import { NextRequest, NextResponse } from "next/server";
import { getDatabase, isMongoConfigured } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const db = await getDatabase();
      if (db) {
        const apps = await db.collection("applications").find({}).sort({ created_at: -1 }).toArray();
        return NextResponse.json({
          status: "success",
          source: "mongodb_atlas",
          applications: apps.map((a) => ({ ...a, id: a._id.toString() })),
        });
      }
    }
    return NextResponse.json({
      status: "success",
      source: "local_mode",
      applications: [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (isMongoConfigured()) {
      const db = await getDatabase();
      if (db) {
        const result = await db.collection("applications").insertOne({
          ...body,
          created_at: new Date(),
          updated_at: new Date(),
        });
        return NextResponse.json({
          status: "success",
          source: "mongodb_atlas",
          application: { ...body, id: result.insertedId.toString() },
        });
      }
    }
    return NextResponse.json({
      status: "success",
      source: "local_mode",
      application: { ...body, id: `local-${Date.now()}` },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateFields } = body;
    if (isMongoConfigured() && id) {
      const db = await getDatabase();
      if (db) {
        await db.collection("applications").updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...updateFields, updated_at: new Date() } }
        );
        return NextResponse.json({ status: "success", message: "Application updated" });
      }
    }
    return NextResponse.json({ status: "success", message: "Updated locally" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
