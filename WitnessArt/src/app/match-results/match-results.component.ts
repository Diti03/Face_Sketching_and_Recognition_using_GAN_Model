import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Match {
  image_url: string;
  similarity_score: number;
}

@Component({
  selector: 'app-match-results',
  templateUrl: './match-results.component.html',
  styleUrls: ['./match-results.component.css']
})
export class MatchResultsComponent implements OnInit {

  @Input() key: number = 0;

  matches: Match[] = [];
  isLoading = true;
  errorMessage = '';

  private baseUrl = 'https://6c2d-34-106-65-82.ngrok-free.app';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMatchResults();
  }

  // Detect when key changes → re-fetch results
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['key'] && !changes['key'].firstChange) {
      this.fetchMatchResults();
    }
  }

  fetchMatchResults(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>(`${this.baseUrl}/match-sketch`, {}).subscribe({
      next: (response) => {
        // Convert response to Match[] structure for display
        this.matches = [
          { image_url: response.match_urls[0], similarity_score: response.scores[0] },
          { image_url: response.match_urls[1], similarity_score: response.scores[1] },
          { image_url: response.match_urls[2], similarity_score: response.scores[2] },
        ];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching match results:', error);
        this.errorMessage = 'Failed to load match results.';
        this.isLoading = false;
      }
    });
    
  }

}
