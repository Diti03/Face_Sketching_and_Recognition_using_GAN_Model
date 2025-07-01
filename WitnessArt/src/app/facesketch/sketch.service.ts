import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class SketchService {
  private baseUrl = 'https://912f-34-168-80-246.ngrok-free.app';
  private isUploading = false;  // Flag to track upload status

  constructor(private http: HttpClient) {}

  async generateAndUploadSketch(prompt: string): Promise<any> {
    // Prevent multiple uploads at the same time
    if (this.isUploading) {
      console.log('Upload already in progress...');
      return;
    }

    // Mark uploading as true to prevent multiple uploads
    this.isUploading = true;

    const formData = new FormData();
    formData.append('prompt', prompt);

    try {
      // 1. Call Colab to get base64 image
      const response = await lastValueFrom(
        this.http.post<{ image: string }>(`${this.baseUrl}/facesketch-base64`, formData)
      );
      const base64Image = response.image;

      // 2. Convert base64 to Blob
      const blob = this.base64ToBlob(base64Image, 'image/jpeg');

      // 3. Create a unique filename
      const filename = `sketch-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;

      // 4. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('sketches')
        .upload(filename, blob, { contentType: 'image/jpeg' });

      if (uploadError) {
        console.error('Upload failed', uploadError.message);
        this.isUploading = false;  // Reset upload state in case of error
        return null;
      }

      // 5. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('sketches')
        .getPublicUrl(filename);

      const publicUrl = publicUrlData?.publicUrl;

      console.log("Public URL returned:", publicUrl);

      // 6. Optional: Insert into Supabase Database
      const { error: insertError } = await supabase
        .from('sketch_records')
        .insert([{ prompt, url: publicUrl }]);

      if (insertError) {
        console.error('Insert failed', insertError.message);
      }

      // Mark upload as complete
      this.isUploading = false;

      return { base64Image, publicUrl };

    } catch (error) {
      console.error('Error generating or uploading sketch:', error);
      this.isUploading = false;  // Reset upload state in case of any error
      return null;
    }
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type });
  }

}



