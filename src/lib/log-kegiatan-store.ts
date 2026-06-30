import {
  getAdminLogKegiatanRecords,
  getLogKegiatanByIdRecord,
  getPublicLogKegiatanRecords,
} from './dynamic-data';

export async function getAdminLogKegiatan() {
  return getAdminLogKegiatanRecords();
}

export async function getPublicLogKegiatan() {
  return getPublicLogKegiatanRecords();
}

export async function getLogKegiatanById(id: number) {
  return getLogKegiatanByIdRecord(id);
}
