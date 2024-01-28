import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
  selector: "app-raster-data-viz",
  templateUrl: "./raster-data-viz.component.html",
  styleUrls: ["./raster-data-viz.component.css"],
})
export class RasterDataVizComponent implements OnInit, OnDestroy {
  map: Map | undefined;
  rasterMetadata: RasterMetadata[] = [];
  // to unsubscribe when component is destroyed
  private dataSubscription: Subscription | undefined;
  layerId: string = "";

  private osmLayer: TileLayer<OSM> = new TileLayer({
    className: "osm",
    source: new OSM(),
  });


  constructor(private route: ActivatedRoute, private api: ApiService, private notificationService: NotificationService) {}


  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        projection: "EPSG:4326",
        center: [0, 0],
        zoom: 1,
      }),
      layers: [
        this.osmLayer
      ],
      target: "ol-map",
    });
    this.dataSubscription = this.api.getRasterData().subscribe((response: any) => {
      this.rasterMetadata = response.data;
      const layer_name  = this.route.snapshot.paramMap.get("id") || "";
      if (response.code == 200 && layer_name) {
        this.toggleVisualize(layer_name, true);
      } else if (response.code == 500) {
        this.notificationService.openSnackBar(response.message);
      }
    });
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


  toggleVisualize(layer_name: string, is_checked: boolean) {
    if (is_checked) {
      this.map?.addLayer(this.costructWmsLayer(layer_name));
    } 
  }


  ngOnDestroy(): void {
    if(this.dataSubscription){
      this.dataSubscription.unsubscribe();
    }
    this.map?.renderSync()
  }
}
