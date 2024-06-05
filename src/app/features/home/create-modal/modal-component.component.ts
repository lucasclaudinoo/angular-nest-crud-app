import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, ReactiveFormsModule, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EntitiesService } from '../../../core/services/entities/entities.service';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { AbstractControl} from '@angular/forms'
import { provideNativeDateAdapter } from '@angular/material/core';
import { CnpjMaskDirective } from '../../../shared/directive/CnpjMaskDirective';

export interface DialogData {
  id?: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  regional: string;
  dataInauguracao: Date;
  ativa: boolean;
  especialidadesMedicas: string[];
  isViewMode: boolean;
}




@Component({
  selector: 'app-modal-component',
  standalone: true,
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.css'],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatSelectModule,
    MatGridListModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatOptionModule,
    CnpjMaskDirective
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideNativeDateAdapter()
  ],
})
export class CreateComponent {
  formGroup: FormGroup;
  especialidadesMedicasList: string[] = [];
  regionais = [
    { value: 'uuid1', label: 'Alto tietê' },
    { value: 'uuid2', label: 'Interior' },
    { value: 'uuid3', label: 'Alto tietê' },
    { value: 'uuid4', label: 'Interior' },
    { value: 'uuid5', label: 'ES' },
    { value: 'uuid6', label: 'SP Interior' },
    { value: 'uuid7', label: 'SP' },
    { value: 'uuid8', label: 'SP2' },
    { value: 'uuid9', label: 'MG' },
    { value: 'uuid10', label: 'Nacional' },
    { value: 'uuid11', label: 'SP CAV' },
    { value: 'uuid12', label: 'RJ' },
    { value: 'uuid13', label: 'SP2' },
    { value: 'uuid14', label: 'SP1' },
    { value: 'uuid15', label: 'NE1' },
    { value: 'uuid16', label: 'NE2' },
    { value: 'uuid17', label: 'SUL' },
    { value: 'uuid18', label: 'Norte' },
  ];
    searchValue = new FormControl('');


    constructor(
      public dialogRef: MatDialogRef<CreateComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private entitiesService: EntitiesService,
      private snackBar: MatSnackBar
    ) {
      this.formGroup = new FormGroup({
        razaoSocial: new FormControl({ value: data?.razaoSocial || '', disabled: data?.isViewMode }, [Validators.required]),
        nomeFantasia: new FormControl({ value: data?.nomeFantasia || '', disabled: data?.isViewMode }, [Validators.required]),
        cnpj: new FormControl({ value: data?.cnpj || '', disabled: data?.isViewMode }, [Validators.required]),
        regional: new FormControl({ value: data?.regional || '', disabled: data?.isViewMode }, [Validators.required]),
        dataInauguracao: new FormControl({ value: data?.dataInauguracao || '', disabled: data?.isViewMode }, [Validators.required]),
        ativa: new FormControl({ value: data?.ativa || false, disabled: data?.isViewMode }),
        especialidadesMedicas: new FormControl({ value: data?.especialidadesMedicas || [], disabled: data?.isViewMode }, [Validators.required, minSelectedSpecialties(5)]),
      });
    

    function minSelectedSpecialties(min: number): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const selectedSpecialties: string[] = control.value;
        if (selectedSpecialties.length < min) {
          return { minSelected: true };
        }
        return null;
      };
    }

    const especialidades = [
      'Cardiologia',
      'Dermatologia',
      'Gastroenterologia',
      'Neurologia',
      'Ortopedia',
      'Pediatria',
      'Psiquiatria',
      'Urologia',
      'Endocrinologia',
      'Oftalmologia'
    ];

    this.especialidadesMedicasList = especialidades;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      if (this.data.id) {
        this.entitiesService.updateEntity(this.data.id, this.formGroup.value).subscribe(
          () => {
            this.dialogRef.close();
            this.showSnackBar('Entidade atualizada com sucesso!', 'success');
          },
          (error: any) => {
            console.error('Erro ao atualizar entidade:', error);
            this.showSnackBar('Erro ao atualizar entidade.', 'error');
          }
        );
      } else {
        // Criar nova entidade
        this.entitiesService.createEntity(this.formGroup.value).subscribe(
          () => {
            this.dialogRef.close();
            this.showSnackBar('Entidade criada com sucesso!', 'success');
          },
          (error: any) => {
            console.error('Erro ao criar entidade:', error);
            this.showSnackBar('Erro ao criar entidade.', 'error');
          }
        );
      }
    } else {
      console.error('Formulário inválido');
    }

  }

  showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.formGroup.get(fieldName);
    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }
  
    if (fieldName === 'dataInauguracao' && field?.hasError('date')) {
      return 'Data inválida';
    }
  
    if (field?.hasError('minSelected')) {
      return 'Selecione pelo menos 5 especialidades';
    }
  
    return '';
  }
}
