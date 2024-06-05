import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EntityModel, ResponseModel } from '../../models/entity.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EntitiesService {
  private apiUrl = `${environment.apiUrl}/organizations`;
  private entities = new BehaviorSubject<EntityModel[]>([]);
  private isLoading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | null>(null);

  entities$ = this.entities.asObservable();
  isLoading$ = this.isLoading.asObservable();
  error$ = this.error.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getEntities(queryString: string, page: number, pageSize: number): Observable<ResponseModel> {
    const url = `${this.apiUrl}?${queryString}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ResponseModel>(url, { headers: this.getHeaders() });
  }

  getEntity(id: string): Observable<EntityModel> {
    this.isLoading.next(true);
    return this.http.get<EntityModel>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(
        () => this.isLoading.next(false),
        () => {
          this.isLoading.next(false);
          this.error.next('Failed to load entity');
        }
      )
    );
  }

  createEntity(entity: EntityModel): Observable<EntityModel> {
    const userId = localStorage.getItem('userId');
    this.isLoading.next(true);
    return this.http.post<EntityModel>(this.apiUrl, {...entity, userId}, { headers: this.getHeaders() }).pipe(
      tap(
        () => this.isLoading.next(false),
        () => {
          this.isLoading.next(false);
          this.error.next('Failed to create entity');
        }
      )
    );
  }

  updateEntity(id: string, entity: EntityModel): Observable<EntityModel> {
    this.isLoading.next(true);
    return this.http.put<EntityModel>(`${this.apiUrl}/${id}`, entity, { headers: this.getHeaders() }).pipe(
      tap(
        () => this.isLoading.next(false),
        () => {
          this.isLoading.next(false);
          this.error.next('Failed to update entity');
        }
      )
    );
  }

  deleteEntity(id: string): Observable<void> {
    this.isLoading.next(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(
        () => this.isLoading.next(false),
        () => {
          this.isLoading.next(false);
          this.error.next('Failed to delete entity');
        }
      )
    );
  }
}
