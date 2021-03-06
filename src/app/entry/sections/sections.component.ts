import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { Evaluation } from 'app/entry/entry-content/evaluations/evaluation.model';
import { EvaluationService } from 'app/entry/entry-content/evaluations/evaluations.service';
import { AppDataService } from 'app/services/app-data.service';
import { SidStatusService } from 'app/services/sid-status.service';
import { Measure } from 'app/entry/entry-content/measures/measure.model';
import { Answer } from 'app/entry/entry-content/questions/answer.model';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PiaService } from 'app/entry/pia.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
  providers: [PiaService]
})
export class SectionsComponent implements OnInit, OnChanges {

  @Input() section: { id: number, title: string, short_help: string, items: any };
  @Input() item: { id: number, title: string, evaluation_mode: string, short_help: string, questions: any };
  data: { sections: any };
  showValidationButton = false;
  showRefuseButton = false;

  constructor(private _piaService: PiaService,
              private _appDataService: AppDataService,
              private _sidStatusService: SidStatusService,
              private _evaluationService: EvaluationService) {
  }

  async ngOnInit() {
    this.data = await this._appDataService.getDataNav();
    this.data.sections.forEach((section: any) => {
      section.items.forEach((item: any) => {
        this._sidStatusService.setSidStatus(this._piaService, section, item);
      });
    });
  }

  ngOnChanges() {
    this._sidStatusService.verification(this._piaService);
  }
}
