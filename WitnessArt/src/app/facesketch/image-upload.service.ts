import { Injectable } from '@angular/core';
import { supabase } from '../supabase';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  async uploadBase64Image(base64Data: string, prompt: string): Promise<string | null> {
    const fileName = `sketch_${Date.now()}.jpg`;
    const file = this.base64ToBlob(base64Data, 'image/jpeg');

    // Upload the image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('face-sketches')
      .upload(fileName, file, {
        contentType: 'image/jpeg'
      });

    if (uploadError) {
      console.error('Upload failed:', uploadError.message);
      return null;
    }

    // Get public URL of uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('face-sketches')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      console.error('Public URL not returned');
      return null;
    }

    // Optionally store metadata in Supabase table
    const { error: dbInsertError } = await supabase.from('sketches').insert([
      { prompt, image_url: publicUrl }
    ]);

    if (dbInsertError) {
      console.error('Failed to insert metadata:', dbInsertError.message);
      return null;
    }

    return publicUrl;
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteString = atob(base64Data);
    const byteArray = new Uint8Array([...byteString].map(char => char.charCodeAt(0)));
    return new Blob([byteArray], { type });
  }
}


