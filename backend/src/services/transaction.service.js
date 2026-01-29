const fs = require('fs');
const csv = require('csv-parser');
const Tesseract = require('tesseract.js');
const TransactionModel = require('../models/transaction.model');
const CategoryModel = require('../models/category.model');

class TransactionService {
    static async addTransaction(userId, data) {
        const categoryId = await this.resolveCategoryId(userId, data);

        // Format date to YYYY-MM-DD for SQLite consistency
        const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        return await TransactionModel.create({
            userId,
            amount: data.amount,
            type: data.type,
            categoryId,
            description: data.description,
            date: formattedDate
        });
    }

    static async updateTransaction(id, userId, data) {
        const categoryId = await this.resolveCategoryId(userId, data);

        const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        return await TransactionModel.update(id, userId, {
            amount: data.amount,
            type: data.type,
            categoryId,
            description: data.description,
            date: formattedDate
        });
    }

    static async resolveCategoryId(userId, data) {
        let categoryId = data.categoryId;

        // If explicit name provided, find or create
        if (!categoryId && data.categoryName) {
            const cat = await CategoryModel.findByName(data.categoryName, userId);
            if (cat) {
                categoryId = cat.id;
            } else {
                const newCat = await CategoryModel.create(data.categoryName, userId);
                categoryId = newCat.id;
            }
        }

        // Fallback: Auto-Predict based on description
        if (!categoryId && data.description) {
            categoryId = await this.predictCategory(userId, data.description);
        }

        return categoryId;
    }

    static async processCsv(userId, filePath) {
        const results = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    try {
                        const transactions = [];
                        for (const row of results) {
                            // Map CSV columns to our schema
                            // Assuming CSV headers: Date, Description, Amount, Type
                            const amount = parseFloat(row.Amount);
                            const type = row.Type ? row.Type.toLowerCase() : (amount < 0 ? 'expense' : 'income');
                            const absAmount = Math.abs(amount);

                            const transaction = await this.addTransaction(userId, {
                                date: row.Date || new Date(),
                                description: row.Description,
                                amount: absAmount,
                                type: type
                            });
                            transactions.push(transaction);
                        }
                        // Cleanup file
                        fs.unlinkSync(filePath);
                        resolve(transactions);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => reject(error));
        });
    }

    static async processImage(userId, filePath) {
        try {
            const { data: { text } } = await Tesseract.recognize(filePath, 'eng');

            // Extract Data (Basic Heuristics)
            const lines = text.split('\n').map(l => l.trim()).filter(l => l);
            let date = new Date();
            let amount = 0;
            let description = 'Unknown Receipt';

            // 1. Find Date (YYYY-MM-DD or MM/DD/YYYY)
            const dateRegex = /(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{2,4})/;
            const dateMatch = text.match(dateRegex);
            if (dateMatch) {
                date = new Date(dateMatch[0]);
            }

            // 2. Find Total Amount
            // Look for "Total" followed by number, or largest number with decimal
            // Regex matches: $10.00, ₹10.00, Rs. 10.00, 10.00
            const priceRegex = /[$₹Rs.\s]*(\d+\.\d{2})/gi;
            let maxAmount = 0;

            // First check for explicit "Total" line
            const totalLine = lines.find(l => l.toLowerCase().includes('total'));
            if (totalLine) {
                const matches = totalLine.match(priceRegex);
                if (matches) {
                    // Clean up string to get just number
                    const numStr = matches[0].replace(/[^0-9.]/g, '');
                    const val = parseFloat(numStr);
                    if (!isNaN(val)) amount = val;
                }
            }

            // Fallback: Find largest number that looks like price
            if (amount === 0) {
                const allPrices = text.match(priceRegex);
                if (allPrices) {
                    allPrices.forEach(p => {
                        const val = parseFloat(p.replace(/[^0-9.]/g, ''));
                        if (val > maxAmount) maxAmount = val;
                    });
                    amount = maxAmount;
                }
            }

            // 3. Find Merchant (usually first non-empty line)
            if (lines.length > 0) {
                description = lines[0]; // Naive assumption: First line is merchant
            }

            // Create Transaction
            const transaction = await this.addTransaction(userId, {
                date: date,
                description: description,
                amount: amount,
                type: 'expense' // Default to expense for receipts
            });

            fs.unlinkSync(filePath); // Cleanup
            return [transaction];

        } catch (error) {
            console.error("OCR Error Details:", error);
            console.error("Failed File Path:", filePath);
            throw new Error('Failed to process image: ' + error.message);
        }
    }

    static async predictCategory(userId, description) {
        console.log(`Predicting category for User: ${userId}, Desc: ${description}`);
        const desc = description ? description.toLowerCase() : '';
        let categoryName = 'Uncategorized';

        // Rule-based engine (MVP)
        if (desc.includes('swiggy') || desc.includes('zomato') || desc.includes('restaurant')) categoryName = 'Food';
        else if (desc.includes('uber') || desc.includes('ola') || desc.includes('fuel')) categoryName = 'Transport';
        else if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('shopping')) categoryName = 'Shopping';
        else if (desc.includes('salary') || desc.includes('credit')) categoryName = 'Income';
        else if (desc.includes('rent')) categoryName = 'Rent';
        else if (desc.includes('netflix') || desc.includes('spotify')) categoryName = 'Entertainment';
        else if (desc.includes('home')) categoryName = 'Home';

        // Find or create category
        let category = await CategoryModel.findByName(categoryName, userId);
        if (!category) {
            category = await CategoryModel.create(categoryName, userId);
        }

        return category ? category.id : null;
    }
}

module.exports = TransactionService;
