import { Component } from '@angular/core';
import { TableComponent } from "../table/table.component";

const fmt = new Intl.DateTimeFormat('hu-HU', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

@Component({
  selector: 'app-values',
  imports: [TableComponent],
  templateUrl: './values.component.html',
  styleUrl: './values.component.css'
})
export class ValuesComponent {
  ms1: number | null = null;
  ms2: number | null = null;
  formatDateTimeLocal(ms: number | null): string {
  if (!Number.isFinite(ms as number)) return '';
  // Produce "YYYY-MM-DDTHH:MM" in local time for <input type="datetime-local">
  const d = new Date(ms as number);
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


  private sortByValidAtAsc = (a: { validAt: number }, b: { validAt: number }) =>
  a.validAt - b.validAt; // ascending; flip for desc [14]
  url = "http://szp.cwskft.hu:8002/values"
  sort = false;
table: (string | number)[][] = [];
titles = ["deviceId", "receivedAt", "validAt", "valueType", "value"]
  ngOnInit() {
    
    this.getBaseData();
  }
  downloadCSV(rows: (string | number)[][] = this.table, filename = 'values.csv') {
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
      valueType: string;
      value: number;
      receivedAt: number;
      validAt: number;
    }[] = await res.json();
    if (this.sort)
    {
          data.sort(this.sortByValidAtAsc);
    }
    this.table = data.map(
  ({ deviceId, receivedAt, validAt, valueType, value }: {
    deviceId: string; valueType: string; value: number; receivedAt: number; validAt: number;
  }): (string | number)[] => [
    deviceId,
    fmt.format(new Date(receivedAt)), // or fmt.format(new Date(receivedAt))
    fmt.format(new Date(validAt)),    // string fits your (string|number)[]
    valueType,
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
      valueType: string;
      value: number;
      receivedAt: number;
      validAt: number;
    }[] = await res.json();
    if (this.sort)
    {
          data.sort(this.sortByValidAtAsc);
    }
    this.table = data.map(
  ({ deviceId, receivedAt, validAt, valueType, value }: {
    deviceId: string; valueType: string; value: number; receivedAt: number; validAt: number;
  }): (string | number)[] => [
    deviceId,
    fmt.format(new Date(receivedAt)), // or fmt.format(new Date(receivedAt))
    fmt.format(new Date(validAt)),    // string fits your (string|number)[]
    valueType,
    value,
  ]
);

  } catch (e) {
    console.error(e);
  }
}
async getDateFilteredData() {
      console.log(this.url + "/date/" + this.ms1 + "/" + this.ms2)

  try {
    if (0 === this.ms1 || 0 === this.ms2) {
      this.getBaseData();
      return;
    }
    console.log(this.url + "/date/" + this.ms1 + "/" + this.ms2)
    const res = await fetch(this.url + "/date/" + this.ms1 + "/" + this.ms2, {
      method: "GET",
      headers: { "ngrok-skip-browser-warning": "true" },
      credentials: "include",
    });
    const data: {
      deviceId: string;
      valueType: string;
      value: number;
      receivedAt: number;
      validAt: number;
    }[] = await res.json();
    if (this.sort)
    {
          data.sort(this.sortByValidAtAsc);
    }
    this.table = data.map(
  ({ deviceId, receivedAt, validAt, valueType, value }: {
    deviceId: string; valueType: string; value: number; receivedAt: number; validAt: number;
  }): (string | number)[] => [
    deviceId,
    fmt.format(new Date(receivedAt)), // or fmt.format(new Date(receivedAt))
    fmt.format(new Date(validAt)),    // string fits your (string|number)[]
    valueType,
    value,
  ]
);

  } catch (e) {
    console.error(e);
  }
}
}
