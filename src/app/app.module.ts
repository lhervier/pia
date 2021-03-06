import { RollbarService, RollbarErrorHandler, rollbarFactory } from './rollbar';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent, SafeHtmlPipe } from './app.component';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppDataService } from 'app/services/app-data.service';
import { HeaderComponent } from './header/header.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { CardsComponent } from './cards/cards.component';
import { CardItemComponent } from './cards/card-item/card-item.component';
import { EntryComponent } from './entry/entry.component';
import { SectionsComponent } from './entry/sections/sections.component';
import { SidStatusService } from 'app/services/sid-status.service';
import { AttachmentsComponent } from './entry/attachments/attachments.component';
import { EntryContentComponent } from './entry/entry-content/entry-content.component';
import { KnowledgeBaseComponent } from './entry/knowledge-base/knowledge-base.component';
import { KnowledgeBaseItemComponent } from './entry/knowledge-base/knowledge-base-item/knowledge-base-item.component';
import { AttachmentItemComponent } from './entry/attachments/attachment-item/attachment-item.component';
import { CommentsComponent } from './entry/entry-content/comments/comments.component';
import { CommentItemComponent } from './entry/entry-content/comments/comment-item/comment-item.component';
import { EvaluationsComponent } from './entry/entry-content/evaluations/evaluations.component';
import { GlobalEvaluationService } from 'app/services/global-evaluation.service';
import { QuestionsComponent } from './entry/entry-content/questions/questions.component';
import { RisksCartographyComponent } from './entry/entry-content/risks-cartography/risks-cartography.component';
import { ActionPlanComponent } from './entry/entry-content/action-plan/action-plan.component';
import { ActionPlanService } from './entry/entry-content/action-plan/action-plan.service';
import { DPOPeopleOpinionsComponent } from './entry/entry-content/dpo-people-opinions/dpo-people-opinions.component';
import { ValidatePIAComponent } from './entry/entry-content/validate-pia/validate-pia.component';
import { RefusePIAComponent } from './entry/entry-content/refuse-pia/refuse-pia.component';
import { PiaValidateHistoryComponent } from './entry/entry-content/validate-pia/pia-validate-history/pia-validate-history.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';
import { ModalsComponent } from './modals/modals.component';
import { MeasuresComponent } from './entry/entry-content/measures/measures.component';
import { MeasureService } from './entry/entry-content/measures/measures.service';
import { ModalsService } from './modals/modals.service';
import { AttachmentsService } from './entry/attachments/attachments.service';
import { KnowledgeBaseService } from './entry/knowledge-base/knowledge-base.service';
import { EvaluationService } from 'app/entry/entry-content/evaluations/evaluations.service';
import { PaginationService } from 'app/entry/entry-content/pagination.service';
import { OverviewRisksComponent } from './entry/entry-content/overview-risks/overview-risks.component';
import { ErrorsComponent } from './errors/errors.component';
import {
    ActionPlanImplementationComponent
  } from './entry/entry-content/action-plan/action-plan-implementation/action-plan-implementation.component';
import { environment } from '../environments/environment';
import { ListItemComponent } from 'app/cards/list-item/list-item.component';
import { SummaryComponent } from './summary/summary.component';
import { AboutComponent } from './about/about.component';

const appRoutes: Routes = [
  { path: '', component: AuthenticationComponent },
  { path: 'home', component: CardsComponent },
  { path: 'home/:view', component: CardsComponent },
  { path: 'entry/:id', component: EntryComponent },
  { path: 'summary/:id/:type', component: SummaryComponent },
  { path: 'entry/:id/section/:section_id/item/:item_id', component: EntryComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'help', component: HelpComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: ErrorsComponent }
];

const providersList: any = [
  AppDataService,
  MeasureService,
  ModalsService,
  AttachmentsService,
  KnowledgeBaseService,
  EvaluationService,
  ActionPlanService,
  PaginationService,
  SidStatusService,
  GlobalEvaluationService
];

if (environment.rollbar_key.length > 0) {
  providersList.push(
    {
      provide: ErrorHandler,
      useClass: RollbarErrorHandler
    },
    {
      provide: RollbarService,
      useFactory: rollbarFactory
    }
  );
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthenticationComponent,
    CardsComponent,
    CardItemComponent,
    EntryComponent,
    SectionsComponent,
    AttachmentsComponent,
    EntryContentComponent,
    KnowledgeBaseComponent,
    KnowledgeBaseItemComponent,
    AttachmentItemComponent,
    CommentsComponent,
    CommentItemComponent,
    EvaluationsComponent,
    QuestionsComponent,
    RisksCartographyComponent,
    ActionPlanComponent,
    DPOPeopleOpinionsComponent,
    ValidatePIAComponent,
    RefusePIAComponent,
    PiaValidateHistoryComponent,
    SettingsComponent,
    HelpComponent,
    ModalsComponent,
    MeasuresComponent,
    OverviewRisksComponent,
    ErrorsComponent,
    ActionPlanImplementationComponent,
    ListItemComponent,
    SummaryComponent,
    SafeHtmlPipe,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    TagInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  exports: [RouterModule],
  providers: providersList,
  bootstrap: [AppComponent]
})
export class AppModule { }
