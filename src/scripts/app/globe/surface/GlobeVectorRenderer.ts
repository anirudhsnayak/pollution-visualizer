import * as THREE from "../../../utils/three.js";
import MathUtils from "../../../utils/MathUtils.js";
import type DirectionVector from "../../data/DirectionVector.js";
import SurfaceData from "./SurfaceData.js";
export default class GlobeVectorRenderer{
    static get INTERPOLATION_POINTS(){return 10;}
    static get VECTOR_FIELD_COLOR(){return 0xff0000;}
    static renderedCurves = [];
    static arrowHeads = [];
    static init(){
        //this.addVector({theta: 4.2, phi: 0.6, directionTheta: 2.1, directionPhi: 0.25});
    }
    static addVector(vector: DirectionVector){
        let curve = new THREE.Curve();
        curve.getPoint = function(t){
            let point = MathUtils.getPointOnSphere(
                vector.theta+vector.directionTheta*t, 
                vector.phi+vector.directionPhi*t, 
                SurfaceData.surfaceRadius
            );
            return point;
        }
        let curveObject = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(curve.getPoints(this.INTERPOLATION_POINTS)),
            new THREE.LineBasicMaterial({color: this.VECTOR_FIELD_COLOR})
        );
        //add an arrowhead to the end of the curve
        let arrowHead = new THREE.Mesh(
            new THREE.ConeGeometry(0.01, 0.05, 32),
            new THREE.MeshBasicMaterial({color: this.VECTOR_FIELD_COLOR})
        );
        arrowHead.position.copy(curve.getPoint(1));
        arrowHead.lookAt(curve.getPoint(1.1));
        arrowHead.rotateX(Math.PI/2); 
        SurfaceData.scene.add(arrowHead);
        SurfaceData.scene.add(curveObject);
        this.arrowHeads.push(arrowHead);
        this.renderedCurves.push(curveObject);
    }
    static clearVectors(){
        //clear every curve in renderedCurves
        for(let i = 0; i < this.renderedCurves.length; i++){
            SurfaceData.scene.remove(this.renderedCurves[i]);
        }
        this.renderedCurves = [];
    }
}