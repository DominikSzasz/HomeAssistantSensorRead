import { Component } from '@angular/core';
import { TableComponent } from "../table/table.component";
const fmt = new Intl.DateTimeFormat('hu-HU', {
  dateStyle: 'medium',
  timeStyle: 'short',
});
@Component({
  selector: 'app-settings',
  imports: [TableComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
private sortByValidAtAsc = (a: { validAt: number }, b: { validAt: number }) =>
  a.validAt - b.validAt; // ascending; flip for desc [14]
  url = "https://e3429f9f0ad5.ngrok-free.app/settings"
  sort = false;
table: (string | number)[][] = [];
titles = ["deviceId", "validAt", "name", "value"]
  ngOnInit() {
    
    this.getBaseData();
  }
  downloadCSV(rows: (string | number)[][] = this.table, filename = 'settings.csv') {
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
      validAt: number;
      name: string;
      value: string;
    }[] = await res.json();
    if (this.sort)
    {
          data.sort(this.sortByValidAtAsc);
    }
    this.table = data.map(
  ({ deviceId, validAt, name, value }: {
    deviceId: string; validAt: number; name: string; value: string;
  }): (string | number)[] => [
    deviceId,
    fmt.format(new Date(validAt)), // or fmt.format(new Date(receivedAt))
    name,
    value,
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
      validAt: number;
      name: string;
      value: string;
    }[] = await res.json();
    if (this.sort)
    {
          data.sort(this.sortByValidAtAsc);
    }
    this.table = data.map(
  ({ deviceId, validAt, name, value }: {
    deviceId: string; validAt: number; name: string; value: string;
  }): (string | number)[] => [
    deviceId,
    fmt.format(new Date(validAt)), // or fmt.format(new Date(receivedAt))
    name,
    value,
  ]
);

  } catch (e) {
    console.error(e);
  }
}
}
