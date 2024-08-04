<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\Printer;

trait PrinterTrait 
{
    public function getPrinter(): Printer
    {
        $connector = new FilePrintConnector(storage_path('app/receipt.txt'));

        return new Printer($connector);
    }

    public function setHeader(Printer $printer)
    {
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->text("Pharmacy Name\n");
        $printer->text("Address\n");
        $printer->text("Phone: 123-456-7890\n");
        $printer->feed();
    }

    public function setFooter(Printer $printer)
    {
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->text("Thank you for your purchase!\n");
        $printer->feed(2);
    }

    public function cutReceipt(Printer $printer)
    {
        $printer->cut();
        $printer->close();
    }

    public function printSaleReceipt($sale)
    {
        $printer = $this->getPrinter();

        $this->setHeader($printer);

        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text("Sale ID: " . $sale->id . "\n");
        $printer->text("Date: " . $sale->created_at . "\n");
        $printer->feed();

        $printer->text(str_pad("Item", 20) . str_pad("Qty", 6) . str_pad("Price", 10) . "Total\n");
        $printer->text(str_repeat("-", 42) . "\n");
        
        foreach ($sale->sale_items as $item) {
            $name = str_pad($item->product->name, 20);
            $quantity = str_pad($item->quantity, 6);
            $price = str_pad(number_format($item->price, 2), 10);
            $total = str_pad(number_format($item['quantity'] * $item->price, 2), 10);

            $printer->text($name . $quantity . $price . $total . "\n");
        }

        $printer->feed();
        $printer->text("Subtotal: " . str_pad("Rs. " . number_format($sale->sub_total, 2), 30) . "\n");
        $printer->text("Discount: " . str_pad("Rs. " . number_format($sale->discount, 2), 30) . "\n");
        $printer->text("Total: " . str_pad("Rs. " . number_format($sale->total, 2), 30) . "\n");
        $printer->feed();

        $this->setFooter($printer);

        $this->cutReceipt($printer);
    }
}