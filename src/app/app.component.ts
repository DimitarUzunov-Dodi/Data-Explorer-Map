import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Angular';

  ngOnInit() {
    const infotainmentPanel = document.querySelector('.infotainment-panel');
    const togglePanelBtn = document.querySelector('#toggle-panel-btn');
    if(togglePanelBtn!=null && infotainmentPanel!=null){
      togglePanelBtn.addEventListener('click', () => {
        infotainmentPanel.classList.toggle('show');
      });
    }
    
  }
}


