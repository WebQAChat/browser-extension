import { Component } from '@angular/core';
import 'deep-chat';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'angular-app';
    initialMessages = [{ role: 'ai', text: 'How can i help you today?' }];
}
