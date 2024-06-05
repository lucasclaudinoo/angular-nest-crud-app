// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { EntityModel, ResponseModel } from '../../core/models/entity.model';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EntitiesService } from '../../core/services/entities/entities.service';
import { CreateComponent } from './create-modal/modal-component.component';
import { SharedModalComponent } from '../../shared/shared-modal/shared-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIcon,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatInput,
    MatButton,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
   ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'Entity';
  displayedColumns: string[] = [
    'nomeFantasia',
    'regional',
    'especialidadesMedicas',
    'ativa',
    'actions',
  ];
  dataSource: MatTableDataSource<EntityModel> = new MatTableDataSource<EntityModel>();
  currentPage: number = 0;
  length: number = 0;
  pageSize: number = 5;
  isEmpty: boolean = true;
  queryString: string = '';
  searchValue: FormControl = new FormControl();
  

  constructor(
    private entitiesService: EntitiesService,
    private dialog: MatDialog 
    ) {}

  ngOnInit(): void {
    this.searchValue.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(value => this.searchEntities(value));

    this.getEntitiesFromServer();
  }

  clearSearch() {
    this.searchValue.setValue('');
  }

  getEntitiesFromServer() {
    this.entitiesService.getEntities(this.queryString, this.currentPage, this.pageSize).subscribe(
      (response: ResponseModel) => {
        this.length = response.totalReports;
        if (response.totalReports > 0) {
          this.setEntities(response.result);
        } else {
          this.currentPage = 0;
          this.setEntities([]);
          this.isEmpty = true;
        }
      },
      (error: any) => {
        console.error('Error:', error);
        this.setEntities([]);
      }
    );
  }
  

  

  setEntities(entities: EntityModel[]) {
    this.dataSource = new MatTableDataSource<EntityModel>(entities);
    this.isEmpty = entities.length === 0;
  }

  searchEntities(value: string): void {
    this.filterEntities();
    if (value === '') {
      let params = new URLSearchParams(this.queryString);
      params.delete('search');
      this.queryString = '?' + params.toString();
      this.getEntitiesFromServer();
    } else {
      value = value.toLowerCase();
      if (value === 'ativo') {
        value = 'true';
      } else if (value === 'inativo') {
        value = 'false';
      }
      this.queryString = `search=${value}`;
      this.getEntitiesFromServer();
    }
  }

  filterEntities() {
    this.generateQueryString();
  }

  generateQueryString() {
    this.queryString = `search=${this.searchValue.value}`;
    this.getEntitiesFromServer();
    console.log('Query string:', this.queryString);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEntitiesFromServer();
  }

  onPreviousPageClick() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getEntitiesFromServer();
    }
  }

  onNextPageClick() {
    if (this.currentPage < Math.ceil(this.length / this.pageSize) - 1) {
      this.currentPage++;
      this.getEntitiesFromServer();
    }
  }

  onFirstPageClick() {
    this.currentPage = 0;
    this.getEntitiesFromServer();
  }

  onLastPageClick() {
    this.currentPage = Math.ceil(this.length / this.pageSize) - 1;
    this.getEntitiesFromServer();
  }

  openModal(entity?: EntityModel): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '40%',
      minWidth: '300px', // Defina o tamanho mínimo desejado aqui
      data: entity || {}
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.getEntitiesFromServer();
    });
  }
  
  

  deleteEntity(id: string): void {
    const dialogRef = this.dialog.open(SharedModalComponent, {
      width: '250px',
      data: { message: 'Tem certeza que deseja deletar esta entidade?' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.entitiesService.deleteEntity(id).subscribe(() => {
          this.getEntitiesFromServer();
        });
      }
    });
  }
}
