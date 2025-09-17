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
  fromMs: number | null = null;
  toMs: number | null = null;

  // Accepts the raw datetime-local strings and converts to epoch ms
  capture(fromISO: string, toISO: string, deviceId: string) {
    this.fromMs = fromISO ? new Date(fromISO).getTime() : null;
    this.toMs = toISO ? new Date(toISO).getTime() : null;
    console.log(`fromMs: ${this.fromMs}, toMs: ${this.toMs}`);
    if ((this.fromMs == null || this.toMs == null) && deviceId === "") {
      this.getBaseData();
      return;
    }
    else if (deviceId === "" && (this.fromMs !== null || this.toMs !== null)) {
      this.getDateFilteredData(this.fromMs ?? 0, this.toMs ?? 0);
      return;
    }
    else if (deviceId !== "" && (this.fromMs == null || this.toMs == null)) {
      this.getFilteredData(deviceId);
      return;
    }
    else {
      this.getDateIdFilteredData(this.fromMs, this.toMs, deviceId);
      return;
    }

  }
private sortByValidAtAsc = (a: { validAt: number }, b: { validAt: number }) =>
  a.validAt - b.validAt; // ascending; flip for desc [14]
  url = "http://szp.cwskft.hu:8002/settings"
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
async getDateFilteredData(ms1:number, ms2:number) {
      console.log(this.url + "/date/" + ms1 + "/" + ms2)

  try {
    if (0 === ms1 || 0 === ms2) {
      this.getBaseData();
      return;
    }
    console.log(this.url + "/date/" + ms1 + "/" + ms2)
    const res = await fetch(this.url + "/date/" + ms1 + "/" + ms2, {
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
async getDateIdFilteredData(ms1:number | null, ms2:number | null, deviceId:string)
{
try {
    if (0 === ms1 || 0 === ms2) {
      this.getBaseData();
      return;
    }
    console.log(this.url + "/dateid/date/" + ms1 + "/" + ms2 + "/id/" + deviceId)
    const res = await fetch(this.url + "/dateid/date/" + ms1 + "/" + ms2 + "/id/" + deviceId, {
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
