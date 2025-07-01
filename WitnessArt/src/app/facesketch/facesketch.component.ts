import { Component, OnInit } from '@angular/core';
import { SketchService } from './sketch.service';

@Component({
  selector: 'app-facesketch',
  templateUrl: './facesketch.component.html',
  styleUrls: ['./facesketch.component.css']
})
export class FacesketchComponent implements OnInit {
  prompt: string = '';
  sketchImage: string | null = null;
  status: string = '';
  isLoading: boolean = false;
  downloadUrl: string | null = null; // Add this property to store the download URL

  // New variables for Match Results flow
  showMatchResultsButton = false;
  showMatchResults = false;
  isMatchResultsLoading = false;
  matchComponentKey = 0;

  constructor(private sketchService: SketchService) { }

  ngOnInit() {
   // this.testConnection();
  }

  // Testing server connection
  testConnection() {
    this.status = 'Testing connection...';
    this.sketchService.generateAndUploadSketch('test').then(
      (response) => {
        this.status = 'Server is connected and ready!';
      },
      (error) => {
        this.status = 'Server connection failed: ' + error;
      }
    );
  }

  // Generate sketch based on user input
  generateSketch() {
    if (!this.prompt) {
      this.status = 'Please enter a prompt';
      return;
    }

    this.isLoading = true;
    this.status = 'Generating sketch... This may take 15-30 seconds...';
    this.sketchImage = null;
    this.downloadUrl = null; // Reset download URL when generating a new sketch

    // Call generateAndUploadSketch service method
    this.sketchService.generateAndUploadSketch(this.prompt).then(
      (response) => {
        if (response.publicUrl) {
          this.sketchImage = response.publicUrl; // Set the generated sketch image URL
          this.downloadUrl = response.publicUrl; // Set the download URL
          this.status = 'Sketch generated successfully!';
          this.showMatchResultsButton = true;

        } else {
          this.status = 'Error generating sketch or uploading image.';
        }
        this.isLoading = false;
      },
      (error) => {
        this.status = 'Error generating sketch: ' + error;
        this.isLoading = false;
      }
    );
  }

  // Method to trigger image download
  downloadImage() {
    if (this.downloadUrl) {
      const timestamp = new Date().getTime();
      const imageUrlWithCacheBypass = `${this.downloadUrl}?t=${timestamp}`;
  
      fetch(imageUrlWithCacheBypass)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'sketch.jpg'; // File name
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url); // Free up memory
          document.body.removeChild(a);
          this.status = 'Sketch downloaded successfully!';
        })
        .catch(error => {
          console.error('Download failed:', error);
          this.status = 'Failed to download sketch.';
        });
    } else {
      this.status = 'No sketch available for download.';
    }
  }

  triggerMatchResults() {

    this.isMatchResultsLoading = true;
    this.showMatchResults = false; // Force re-create component
    this.matchComponentKey++;      // Increment key to trigger fresh MatchResultsComponent
    this.showMatchResults = true;  // Show component again
    this.isMatchResultsLoading = false;
    
    
  }

  
  
  
}





