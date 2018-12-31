import {
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
	MatExpansionModule,
	MatProgressSpinnerModule,
	MatPaginatorModule,
	MatDialogModule
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
	exports: [
		MatInputModule,
		MatCardModule,
		MatButtonModule,
		MatDialogModule,
		MatToolbarModule,
		MatExpansionModule,
		MatPaginatorModule,
		MatProgressSpinnerModule
	]
})
export class AngularMaterialModule {}
