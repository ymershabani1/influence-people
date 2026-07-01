<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('influencers', function (Blueprint $table) {
            $table->renameColumn('biography', 'information');
            $table->string('followers_mode')->default('manual')->after('followers_count');
            $table->json('social_followers')->nullable()->after('followers_mode');
        });
    }

    public function down(): void
    {
        Schema::table('influencers', function (Blueprint $table) {
            $table->dropColumn(['followers_mode', 'social_followers']);
            $table->renameColumn('information', 'biography');
        });
    }
};
