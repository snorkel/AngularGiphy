import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})

export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private _apiKey = 'HZamjRQW01tghVxHYbqvqwNvRWVNNsgA';
  private serviceUrl = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this.tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  public searchTag(tag: string): void {
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=HZamjRQW01tghVxHYbqvqwNvRWVNNsgA&q=valorant&limit=10')   .then(resp => resp.json()).then(data => console.log(data));

    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this._apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe(resp => {
        this.gifList = resp.data;
      });
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    const lsHistory = localStorage.getItem('history');
    if (!lsHistory) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    this.searchTag(this._tagsHistory[0]);
  }
}
// HZamjRQW01tghVxHYbqvqwNvRWVNNsgA
