import { Component } from '@angular/core';
import { TableComponent } from "../table/table.component";
const fmt = new Intl.DateTimeFormat('hu-HU', {
  dateStyle: 'medium',
  timeStyle: 'short',
});
@Component({
  selector: 'app-logs',
  imports: [TableComponent],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent {
private sortByValidAtAsc = (a: { validAt: number }, b: { validAt: number }) =>
  a.validAt - b.validAt; // ascending; flip for desc [14]
  url = "http://szp.cwskft.hu:8002/logs"
  sort = false;
table: (string | number)[][] = [];
titles = ["deviceId", "recievedAt", "logLevel", "logMsg"]
  ngOnInit() {
    
    this.getBaseData();
  }
  downloadCSV(rows: (string | number)[][] = this.table, filename = 'logs.csv') {
  const escape = (v: string | number) => {
    const s = String(v);
    // Quote fields containing separator, quotes, or newlines; escape quotes by doubling
    return /[\";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map(r => r.map(escape).join(';')).join('\r\n'); // use ;
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}


async getBaseData() {
  try {
    const res = await fetch(this.url, {
      method: "GET",
      headers: { "ngrok-skip-browser-warning": "true" },
      credentials: "include",
    });
    const data: {
      deviceId: string;
      receivedAt: number;
      logLevel: string;
      logMsg: string;
    }[] = await res.json();
    this.table = data.map(
  ({ deviceId, receivedAt, logLevel, logMsg }: {
    deviceId: string; receivedAt: number; logLevel: string; logMsg: string;
  }): (string | number)[] => [
    deviceId,
    fmt.format(new Date(receivedAt)), // or fmt.format(new Date(receivedAt))
    logLevel,
    logMsg,
  ]
);

  } catch (e) {
    console.error(e);
  }
}
async getFilteredData(deviceId:string) {
  try {
    if ("" === deviceId) {
      this.getBaseData();
      return;
    }
    const res = await fetch(this.url + "/id/" + deviceId, {
      method: "GET",
      headers: { "ngrok-skip-browser-warning": "true" },
      credentials: "include",
    });
    const data: {
      deviceId: string;
      receivedAt: number;
      logLevel: string;
      logMsg: string;
    }[] = await res.json();
    this.table = data.map(
  ({ deviceId, receivedAt, logLevel, logMsg }: {
    deviceId: string; receivedAt: number; logLevel: string; logMsg: string;
  }): (string | number)[] => [
    deviceId,
    fmt.format(new Date(receivedAt)), // or fmt.format(new Date(receivedAt))
    logLevel,
    logMsg,
  ]
);

  } catch (e) {
    console.error(e);
  }
}
}
