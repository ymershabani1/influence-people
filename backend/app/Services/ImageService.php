<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ImageService
{
    private const MAX_WIDTH = 800;

    private const THUMBNAIL_WIDTH = 300;

    public function uploadProfileImage(UploadedFile $file, ?string $oldImage = null, ?string $oldThumbnail = null): array
    {
        $this->deleteImages($oldImage, $oldThumbnail);

        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        if (! in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            $extension = 'jpg';
        }

        $filename = Str::uuid().'.'.$extension;
        $path = 'influencers/'.$filename;
        $thumbnailPath = 'influencers/thumbnails/'.$filename;
        $sourcePath = $file->getRealPath();

        // Read separately (no clone) to avoid memory exhaustion on large PNGs
        $main = Image::read($sourcePath)->scaleDown(width: self::MAX_WIDTH);
        Storage::disk('public')->put($path, (string) $this->encodeImage($main, $extension));
        unset($main);

        $thumbnail = Image::read($sourcePath)->scaleDown(width: self::THUMBNAIL_WIDTH);
        Storage::disk('public')->put($thumbnailPath, (string) $this->encodeImage($thumbnail, $extension));
        unset($thumbnail);

        return [
            'profile_image' => $path,
            'profile_image_thumbnail' => $thumbnailPath,
        ];
    }

    public function deleteImages(?string $imagePath, ?string $thumbnailPath): void
    {
        if ($imagePath && Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }

        if ($thumbnailPath && Storage::disk('public')->exists($thumbnailPath)) {
            Storage::disk('public')->delete($thumbnailPath);
        }
    }

    private function encodeImage(mixed $image, string $extension): mixed
    {
        return match ($extension) {
            'png' => $image->toPng(),
            'webp' => $image->toWebp(),
            default => $image->toJpeg(quality: 85),
        };
    }
}
