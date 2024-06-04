import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EntitiesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEntities(queryString: string = ''): Observable<any> {
    return this.http.get(`${this.apiUrl}${queryString}`);
  }

  getEntity(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createEntity(entity: any): Observable<any> {
    return this.http.post(this.apiUrl, entity);
  }

  updateEntity(id: string, entity: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, entity);
  }

  deleteEntity(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}