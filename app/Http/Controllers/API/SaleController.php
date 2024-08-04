<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Traits\PrinterTrait;
use App\Traits\SaleTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\Printer;

class SaleController extends Controller
{
    use SaleTrait, PrinterTrait;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        $input = $request->validated();

        $subtotal = $this->calculateSubtotal($input['items']);

        $discount = $this->calculateDiscount($input['discount'], $input['discount_type'], $subtotal);

        $total = $this->calculateTotal($subtotal, $discount);

        $sale = DB::transaction(function() use ($input, $subtotal, $discount, $total) {
            // Create the sale
            $sale = Sale::create([
                'sub_total' => $subtotal,
                'discount' => $discount,
                'total' => $total,
            ]);

            // Create sale items
            foreach ($input['items'] as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            return $sale;
        });

        $sale->load('sale_items.product');
        
        $this->printSaleReceipt($sale);

        return response()->json(['success' => true, 'sale' => $sale], Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        //
    }
}
