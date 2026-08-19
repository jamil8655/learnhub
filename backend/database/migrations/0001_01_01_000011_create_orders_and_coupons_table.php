<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('discount_value', 10, 2);
            $table->decimal('min_purchase', 10, 2)->default(0.00);
            $table->unsignedInteger('max_usage')->default(1000);
            $table->unsignedInteger('used_count')->default(0);
            $table->boolean('active')->default(true)->index();
            $table->boolean('is_active')->default(true);
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('expires_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('coupon_id')->nullable()->constrained('coupons')->nullOnDelete();
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('coupon_code', 50)->nullable();
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->decimal('discount', 10, 2)->default(0.00);
            $table->decimal('tax', 10, 2)->default(0.00);
            $table->decimal('total', 10, 2)->default(0.00);
            $table->string('currency', 10)->default('USD');
            $table->string('payment_method')->default('free');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('paid')->index();
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled', 'refunded'])->default('completed')->index();
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('item_type', 50)->default('course');
            $table->unsignedBigInteger('item_id')->nullable();
            $table->string('item_title');
            $table->decimal('unit_price', 10, 2)->default(0.00);
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->timestamps();

            $table->index(['order_id', 'item_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('coupons');
    }
};
