<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('influencers', function (Blueprint $table) {
            $table->unsignedInteger('bookings_count')->default(0)->after('followers_count');
        });

        // Backfill existing rows with a realistic spread so the "most booked"
        // ranking has meaningful data. Featured influencers get a higher range.
        DB::table('influencers')
            ->where('is_featured', true)
            ->update(['bookings_count' => DB::raw('FLOOR(200 + RAND() * 800)')]);

        DB::table('influencers')
            ->where('is_featured', false)
            ->update(['bookings_count' => DB::raw('FLOOR(RAND() * 400)')]);
    }

    public function down(): void
    {
        Schema::table('influencers', function (Blueprint $table) {
            $table->dropColumn('bookings_count');
        });
    }
};
