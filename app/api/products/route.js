import Product from "../../../models/productModel";
import { connectDB } from "../../../lib/db";
import { NextResponse } from "next/server";

export const GET = async (req) => {
    try {
        
        await connectDB();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 12;
        const category = searchParams.get("category");
        const cursorId = searchParams.get("cursorId");
        const cursorUpdatedAt = searchParams.get("cursorUpdatedAt");

        const query = {};

        if (category) {
            query.category = category;
        }
        
        if (cursorId && cursorUpdatedAt) {
            query.$or = [
                { updatedAt: { $lt: new Date(cursorUpdatedAt) } },
                { updatedAt: new Date(cursorUpdatedAt), _id: { $lt: cursorId } }
            ];
        }

        const products = await Product.find(query)
            .sort({ updatedAt: -1, _id: -1 })
            .limit(limit + 1)
            .lean();
        
        const hasMore = products.length > limit;

        if (hasMore) {
            products.pop();
        }

        const count = products.length;

        const lastProduct = products[products.length - 1];
        const nextCursor = lastProduct ? { cursorId: lastProduct._id, cursorUpdatedAt: lastProduct.updatedAt } : null;

        return NextResponse.json({ products, hasMore, count, nextCursor }, { status: 200 });
        
        
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}