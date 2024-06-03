import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";
import { Component, HostBinding, Input } from "@angular/core";
import { MenuService } from "./menu/menu.service";
import { Subscription } from "rxjs";

@Component({
    selector: '[app-menuitem]',
    template: `
    <ng-container>
        <div *ngIf="root" class="layout-menuitem-root-text">{{item?.label}}</div>
        <a *ngIf="(!item.routerLink || item.items)" (click)="itemClick($event)">
            <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
            <span>{{ item?.label }}</span>
            <!-- dropdown arrow icon -->
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
        </a>

        <a *ngIf="(item.routerLink && !item.items)" (click)="itemClick($event)">
            <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
            <span>{{ item?.label }}</span>
            <!-- dropdown arrow icon -->
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
        </a>

        <ul *ngIf="item.items" [@children]="submenuAnimation" >
            <!-- use of ngFor in ngTemplates -->
            <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
                <!-- TODO use class=child.badgeClass -->
				<li app-menuitem [item]="child" [index]="i" [parentKey]="key"></li>
			</ng-template>
        </ul>
    </ng-container>`,
    animations: [
        trigger('children', [
            state('collapsed', style({
                height: '0'
            })),
            state('expanded', style({
                height: '*'
            })),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})

export class MenuitemCopmonent {
    @Input() item: any;

    @Input() index!: number;

    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

    @Input() parentKey!: string;

    key: string = "";

    active : boolean = false;

    menuSourceSubscription: Subscription;

    constructor(private menuService: MenuService) {
        this.menuSourceSubscription = this.menuService.menuSource$.subscribe((value => {
            // TODO route event check
            if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                this.active = false;
            }
        }));
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
        // console.warn('check', this.item)
    }

    itemClick(event: Event) {
        // TODO implement processinng disabled

        // TODO excute command

        // toggle active state
        if(this.item.items) {
            this.active = !this.active;
        }

        this.menuService.onMenuStateChange({key: this.key})
    }

    get submenuAnimation() {
        return this.root ? 'expanded' : (this.active ? 'expanded' : 'collapsed');
    }

    @HostBinding('class.active-menuitem') 
    get activeClass() {
        return this.active && !this.root;
    }

    ngOnDestroy() {
        if(this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }
    }
}