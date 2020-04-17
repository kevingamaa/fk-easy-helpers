import { NgModule, ModuleWithProviders  } from '@angular/core';
import { KfEasyHelpersComponent } from './kf-easy-helpers.component';
import { StatusComponent } from './status/status.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { HelperService } from './services/helper.service';
import { ModelRest } from './services/model-rest.service';
import { ControllerComponent } from './controller/controller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KF_ENV } from './kf-env-config';
import { LoadingComponent } from './loading/loading.component';
import { MaterialModule } from './material/material.module';
import { KfEnvType } from './kf-env-type';




@NgModule({
    declarations: [
        KfEasyHelpersComponent, 
        StatusComponent, 
        FilterComponent, 
        ControllerComponent, 
        LoadingComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        KfEasyHelpersComponent,
        StatusComponent,
        FilterComponent,
        ControllerComponent,
        LoadingComponent
    ]
})
export class KfEasyHelpersModule {
    static forRoot(env?: KfEnvType): ModuleWithProviders<KfEasyHelpersModule> {
        return {
            ngModule: KfEasyHelpersModule,
            providers: [
                HelperService,
                {
                    provide: KF_ENV, // you can also use InjectionToken
                    useValue: env,
                }
            ]
        };
    }
}
