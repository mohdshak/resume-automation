import { NextRequest, NextResponse } from "next/server";
import { getDatabase, isMongoConfigured } from "@/lib/mongodb";

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const db = await getDatabase();
      if (db) {
        const collection = db.collection("master_profiles");
        const profile = await collection.findOne({}, { sort: { updated_at: -1 } });
        if (profile) {
          const { _id, ...cleanProfile } = profile;
          return NextResponse.json({
            status: "success",
            source: "mongodb_atlas",
            profile: cleanProfile,
          });
        }
      }
    }
    return NextResponse.json({
      status: "success",
      source: "client_fallback",
      message: "No cloud profile found or running in local mode",
    });
  } catch (error: any) {
    console.error("MongoDB GET profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (isMongoConfigured()) {
      const db = await getDatabase();
      if (db) {
        const collection = db.collection("master_profiles");
        const doc = {
          ...body,
          updated_at: new Date(),
        };
        await collection.updateOne(
          { "basics.name": body.basics?.name || "Default Candidate" },
          { $set: doc },
          { upsert: true }
        );
        return NextResponse.json({
          status: "success",
          source: "mongodb_atlas",
          message: "Profile saved to MongoDB Atlas",
          profile: body,
        });
      }
    }
    return NextResponse.json({
      status: "success",
      source: "local_mode",
      profile: body,
    });
  } catch (error: any) {
    console.error("MongoDB PUT profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
