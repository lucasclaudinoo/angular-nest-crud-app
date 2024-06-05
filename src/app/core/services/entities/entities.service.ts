// src/app/core/services/entities/entities.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getEntities(queryString: string, page: number, pageSize: number): Observable<ResponseModel> {
    const url = `${this.apiUrl}?${queryString}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ResponseModel>(url);
  }
  

  getEntity(id: string): Observable<EntityModel> {
    this.isLoading.next(true);
    return this.http.get<EntityModel>(`${this.apiUrl}/${id}`).pipe(
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
    this.isLoading.next(true);
    return this.http.post<EntityModel>(this.apiUrl, entity).pipe(
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
    return this.http.put<EntityModel>(`${this.apiUrl}/${id}`, entity).pipe(
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
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
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
