import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'https://api.example.com/data';
  constructor(private http: HttpClient) { 
  }
  getData() {
    return this.http.get(this.apiUrl);
  }
  
}
