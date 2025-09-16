import { Routes } from '@angular/router';
import { ValuesComponent } from './values/values.component';
import { LogsComponent } from './logs/logs.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    {
    path: '',
    component: ValuesComponent,
    },
    {
    path: 'values',
    component: ValuesComponent,
    },
    {
    path: 'settings',
    component: SettingsComponent,
    },
    {
    path: 'logs',
    component: LogsComponent,
    },
];
