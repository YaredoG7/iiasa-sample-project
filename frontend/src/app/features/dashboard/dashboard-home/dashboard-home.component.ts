/***
 * 
 * NEEDS REFACTOR: BASED DRY PRINCIPLE
 * 
 */

import { Component, OnDestroy, OnInit } from "@angular/core";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";
import { Subscription } from "rxjs";
import { RasterMetadata } from "src/app/core/model/config.model";
import { ApiService } from "src/app/core/services/api.service";
import { NotificationService } from "src/app/core/services/notification.service";

@Component({
  selector: "app-dashboard-home",
  templateUrl: "./dashboard-home.component.html",
  styleUrls: ["./dashboard-home.component.css"],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  map: Map | undefined;
  wmsLayer: TileLayer<TileWMS> | undefined;
  rasterMetadata: RasterMetadata[] = [];
  // to unsubscribe when component is destroyed
  private dataSubscription: Subscription | undefined;

  layerId: string = "";
  showOsmData: boolean = true;
  private osmLayer: TileLayer<OSM> = new TileLayer({
    className: "osm",
    source: new OSM(),
  });

  constructor( private api: ApiService, private notificationService: NotificationService) {}


  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        projection: "EPSG:4326",
        center: [0, 0],
        zoom: 1,
      }),
      layers: [this.osmLayer],
      target: "ol-map",
    });

    this.loadRasterMetadata()
  }

  loadRasterMetadata() {
    this.dataSubscription =  this.api.getRasterData().subscribe((response: any) => {
      this.rasterMetadata = response.data;
      if (response.data.code == 200 > 0 && this.layerId) {
        this.addWMSLayer(this.layerId);
      }

      if (response.code == 500) {
        this.notificationService.openSnackBar(response.message);
      }
    });
  }

  reloadMap() {
    this.api.reloadMap().subscribe((response: any) => {
      this.notificationService.openSnackBar(response.message);
    }, (err: any) => {
      this.notificationService.openSnackBar(`Unknown error: ${err.error.message}`);
    })
  }

  private costructWmsLayer(layer_name: string): TileLayer<TileWMS>{
    const filteredLayers = this.rasterMetadata.filter(
      (layer) => layer.layer_name === layer_name
    );
    if (filteredLayers.length > 0) {
      const layer = filteredLayers[0];
      const baseUrl = layer.layer_info.coverageStore.coverages.replace(
        /\/rest[\s\S]*/,
        ""
      );
      const formattedUrl = this.net_loc(baseUrl);
      const workspace = layer.layer_info.coverageStore.workspace.name;
      const serverType = "geoserver";
      return new TileLayer({
        className: layer_name,
        source: new TileWMS({
          url: `${formattedUrl}/${workspace}/wms`,
          params: {
            LAYERS: `${workspace}:${layer.layer_name}`,
            TILED: false,
          },
          serverType: serverType,
        }),
      });
    } else {
      return new TileLayer({
        className: layer_name,
        source: new TileWMS({
          url: "",
          params: {
            LAYERS: "",
            TILED: false,
          },
          serverType: "geoserver",
        }),
      });
    }
  }

  private net_loc(url: string) {
    return url.replace(/:\/\/\S+?(\d+)/, '://localhost:$1');
  }

  addWMSLayer(layer_name: string): void {
    if (this.map) {
      const wmsLayer = this.costructWmsLayer(layer_name);
      this.map.addLayer(wmsLayer);
    }
  }

  showOsm(show: boolean) {
    if (show) {
      this.osmLayer = new TileLayer({
        className: "osm",
        source: new OSM(),
      });
      this.map?.addLayer(this.osmLayer);
    } else {
      if (this.osmLayer) {
        this.map?.removeLayer(this.osmLayer);
      }
    }
  }

  toggleVisualize(layer_name: string, is_checked: boolean) {
    if (is_checked) {
      this.map?.addLayer(this.costructWmsLayer(layer_name));
    } else {
      this.removeLayerByName(layer_name);
    }
  }

  private removeLayerByName(layerName: string) {
    const layer = this.map?.getLayers().getArray().find((l: any) => l.getClassName() === layerName);
    if (layer) {
      // Remove the layer from the map and update the layers array
      this.map?.removeLayer(layer);
      // Trigger a redraw of the map
      this.map?.renderSync();
    } else {
      console.error(`Layer not found with name: ${layerName}`);
    }
  }


  ngOnDestroy(): void {
    console.log(":ngDestroyed")
    if(this.dataSubscription){
      this.dataSubscription.unsubscribe();
    }
    this.map?.removeLayer(this.osmLayer);
    this.map?.renderSync()
  }
}
