import { NextResponse } from "next/server";
import { parseEducationTrainingLearningOperationsCenter } from "@/lib/aipify/education-training-learning-operations-pack";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_education_training_learning_operations_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEducationTrainingLearningOperationsCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load education center" }, { status: 500 });
  }
}
