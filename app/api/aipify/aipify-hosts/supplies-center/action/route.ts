import { NextResponse } from "next/server";
import {
  createAipifyHostsInventoryItem,
  createAipifyHostsInventorySupplier,
  performAipifyHostsInventoryAction,
  recordAipifyHostsInventoryPurchase,
  updateAipifyHostsInventoryQuantity,
} from "@/lib/core/aipify-hosts-supplies-center";
import { parseAipifyHostsSuppliesCenterActionResult } from "@/lib/aipify/aipify-hosts-supplies-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      item_id?: string;
      item_name?: string;
      category?: string;
      property_id?: string;
      current_quantity?: number;
      minimum_quantity?: number;
      unit_type?: string;
      quantity?: number;
      supplier_name?: string;
      cost?: number;
      purchase_date?: string;
      contact_information?: string;
      preferred_supplier?: boolean;
      action_type?: string;
      assigned_to?: string;
      due_date?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "create_item":
        if (!body.item_name?.trim() || !body.category) {
          return NextResponse.json({ error: "item_name and category required" }, { status: 400 });
        }
        data = await createAipifyHostsInventoryItem(supabase, {
          itemName: body.item_name.trim(),
          category: body.category,
          propertyId: body.property_id,
          currentQuantity: body.current_quantity,
          minimumQuantity: body.minimum_quantity,
          unitType: body.unit_type,
        });
        break;
      case "update_quantity":
        if (!body.item_id || body.quantity == null) {
          return NextResponse.json({ error: "item_id and quantity required" }, { status: 400 });
        }
        data = await updateAipifyHostsInventoryQuantity(supabase, body.item_id, body.quantity);
        break;
      case "record_purchase":
        if (!body.supplier_name?.trim() || body.quantity == null) {
          return NextResponse.json({ error: "supplier_name and quantity required" }, { status: 400 });
        }
        data = await recordAipifyHostsInventoryPurchase(supabase, {
          supplierName: body.supplier_name.trim(),
          quantity: body.quantity,
          propertyId: body.property_id,
          itemId: body.item_id,
          cost: body.cost,
          purchaseDate: body.purchase_date,
        });
        break;
      case "create_supplier":
        if (!body.supplier_name?.trim() || !body.category) {
          return NextResponse.json({ error: "supplier_name and category required" }, { status: 400 });
        }
        data = await createAipifyHostsInventorySupplier(supabase, {
          supplierName: body.supplier_name.trim(),
          category: body.category,
          contactInformation: body.contact_information,
          preferredSupplier: body.preferred_supplier,
        });
        break;
      case "inventory_action":
        if (!body.item_id || !body.action_type) {
          return NextResponse.json({ error: "item_id and action_type required" }, { status: 400 });
        }
        data = await performAipifyHostsInventoryAction(supabase, {
          itemId: body.item_id,
          actionType: body.action_type,
          assignedTo: body.assigned_to,
          dueDate: body.due_date,
          quantity: body.quantity,
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsSuppliesCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
