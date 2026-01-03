import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { QueueService } from '../core/services/queue.service';
import { Song } from '../core/models/song.model';
import { Observable, Subject, timer, merge } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css'
})
export class QueueComponent implements OnInit, OnDestroy {
  private queueService = inject(QueueService);
  private destroy$ = new Subject<void>();
  public queue$!: Observable<Song[]>;

  ngOnInit(): void {
    // Refresh queue on: initial load, every 5 seconds, or when a song is added
    this.queue$ = merge(
      timer(0, 5000),
      this.queueService.queueRefresh$
    ).pipe(
      switchMap(() => this.queueService.getQueue()),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
