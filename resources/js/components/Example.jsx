import React from 'react';
import ReactDOM from 'react-dom';
import { kml } from "@tmcw/togeojson";
import {useEffect, useState} from "react";
import axios from 'axios';

function Example() {

    const [file, setFile] = useState( null );
    const [status, setStatus] = useState('No file selected');
    const [values, setValues] = useState({
        lng: 0,
        lat: 0 
    });
    const [errors, setErrors] = useState(null);



    const readFile = () => {
        if (!file) {
            setStatus('No file selected');
            return;
        }

        setStatus('Loading File');
        const reader = new FileReader();
        reader.onload = (e) => {
            setStatus('File Loaded');
            const content = e.target.result;


            setStatus('XML parsing');
            const xml = convertToXmlDom(content);

            if(!xml){
                setStatus('XML parsing failed')
                return;
            }

            setStatus('Converting to GeoJSON');

            const geoJson = kml(xml);
            setStatus('Success');

            const coords = geoJson.features.map((feature) => ({
                lng: feature.geometry.coordinates[0],
                lat: feature.geometry.coordinates[1]
                // elv: feature.geometry.coordinates[2],     //// WIP
            }));

            
            const jCoords = JSON.stringify(coords);
            setValues(jCoords);
            sendToServer(jCoords);


//////////////

// LNG/LAT on 39/40 switched - Gulf of Aden

/////////////
        };

        reader.readAsText(file);
    }

    const sendToServer = async (jCoords) => {

        setErrors({}); 

        const response = await fetch('/api/json/store', {
            method: "POST", 
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                "X-CSRF-TOKEN": document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content"),
            },
            body: (jCoords),
        });
    }

    const convertToXmlDom = (text) => {
        const parser = new DOMParser();

        const xml = parser.parseFromString(text,"text/xml");

        if(xml.getElementsByTagName("parsererror").length > 0){
            return null;
        }
        return xml;
    }

    return (
        
        <div className="container">
               <form>
                    <div style={{width: '75vw',display: 'flex', justifyContent:'space-evenly'}}>
                        <input
                            type="file"
                            onChange={( e ) => {
                                setFile( e.target.files[ 0 ] )
                            }}
                            name='data'
                        />
                        <button onClick={() => readFile()}>
                            Convert!
                        </button>
                    </div>
                    <h2>{status}</h2>
               </form>
        </div>
        
    );
}

export default Example;

if (document.getElementById('App')) {
    ReactDOM.render(<Example />, document.getElementById('App'));
}
