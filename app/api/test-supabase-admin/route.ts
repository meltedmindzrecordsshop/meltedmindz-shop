import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;

    const { data, error } = await supabaseAdmin
      .from("customers")
      .insert({
        email: testEmail,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase admin test error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("customers")
      .delete()
      .eq("id", data.id);

    if (deleteError) {
      console.error(
        "Supabase cleanup error:",
        deleteError
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Supabase admin connection and database permissions are working.",
      insertedId: data.id,
      cleanupSuccessful: !deleteError,
    });
  } catch (error) {
    console.error(
      "Supabase admin connection failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}