import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataFetch } from './DataFetchingForCityTable';
import '../Styles/DataTable.css'


export default function AdvancedFilterDemo() {
  const [cityData, setCityData] = useState([]);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    setLoading(true);
    DataFetch.getCityDataMedium().then((data) => {
      setCityData(getcityData(data));
      setLoading(false);
    });
    initFilters();
  }, []);

  const getcityData = (data) => {
    return data
      .map((road) => {
        return Object.entries(road.points).map(([key, point]) => ({
          road_name: road.road_name,
          point_name: point.point_name,
          start_latlong_point: point.start_latlong_point,
          end_latlong_point: point.end_latlong_point,
          direction: point.direction,
        }));
      })
      .flat();
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      road_name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      point_name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue('');
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
        />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={cityData}
        paginator
        showGridlines
        rows={10}
        loading={loading}
        dataKey="id"
        filters={filters}
        globalFilterFields={['road_name', 'point_name']}
        header={header}
        emptyMessage="No data found."
      >
        <Column
          field="road_name"
          header="Road Name"
          filter
          filterPlaceholder="Search by road name"
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="point_name"
          header="Point Name"
          filter
          filterPlaceholder="Search by point name"
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="start_latlong_point"
          header="Start Point"
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="end_latlong_point"
          header="End Point"
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="direction"
          header="Direction"
          style={{ minWidth: '12rem' }}
        />
      </DataTable>
    </div>
  );
}
