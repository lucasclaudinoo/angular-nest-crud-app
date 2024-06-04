import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EntityModel, ResponseModel } from '../../core/models/entity.model';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIcon,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginator,
    MatTable,
    MatInputModule,
    MatInput,
    MatButton,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  title = 'Entity';
  displayedColumns: string[] = [
    'name',
    'region',
    'specialties',
    'active',
    'actions',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  loadDataSubscription: Subscription = new Subscription();
  currentPage: number = 0;
  length: number = 0;
  pageSize: number = 10;
  isEmpty: boolean = true;
  queryString: string = '';
  searchValue: FormControl = new FormControl();

  // ELEMENT_DATA: any[] = [
  //   { name: 'Entity 1', region: 'Region 1', specialties: 'Specialty 1', active: 'Active' },
  //   { name: 'Entity 2', region: 'Region 2', specialties: 'Specialty 2', active: 'Active' },
  //   { name: 'Entity 3', region: 'Region 3', specialties: 'Specialty 3', active: 'Active' },
  //   { name: 'Entity 4', region: 'Region 4', specialties: 'Specialty 4', active: 'Active' },
  //   { name: 'Entity 5', region: 'Region 5', specialties: 'Specialty 5', active: 'Active' },
  // ];

  constructor() {}

  ngOnInit(): void {
    this.searchValue.valueChanges
    .pipe((debounceTime(500)),
    distinctUntilChanged())
    .subscribe(value => this.searchEntities(value));

    // this.getEntitiesFromServer();
  }
  
  // getEntitiesFromServer() {
  //   if (this.loadDataSubscription) {
  //     this.loadDataSubscription.unsubscribe();
  //   }
  
  //   this.loadDataSubscription = this.yourService
  //     .getEntities(this.currentPage, this.queryString)
  //     .subscribe(
  //       (responseModel: ResponseModel) => {
  //         this.length = responseModel.totalReports;
  //         if (responseModel.totalReports > 0) {
  //           this.setEntities(responseModel.result);
  //         } else {
  //           this.currentPage = 0;
  //           this.setEntities([]);
  //           this.isEmpty = true;
  //         }
  //       },
  //       (error) => {
  //         console.error('Error:', error);
  //         this.setEntities([]);
  //       }
  //     );
  // }
  
  setEntities(entities: EntityModel[]) {
    this.dataSource = new MatTableDataSource<EntityModel>(entities);
    if (entities.length > 0) {
      this.isEmpty = false;
    }
  }
  
  searchEntities(value: string): void {
    console.log(value)
    if (value.length > 2) {
      this.filterEntities();
    }
    if (value === '') {
      let params = new URLSearchParams(this.queryString);
      params.delete('search');
      this.queryString = '?' + params.toString();
      // this.getEntitiesFromServer();
    }
  }
  
  filterEntities() {
    this.generateQueryString();
    // this.getEntitiesFromServer();
  }
  
  generateQueryString() {
    // gera a query string aqui
  }
}