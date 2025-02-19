import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import FileUpload from "./components/fileupload/FileUpload";
import "./App.css";
import WireframeAppSample from "./components/wireframe/WireframeSample";

function App() {
    return (
        <div className="App">
            <Header />
            <hr className="divider" />
            <main>
                <Routes>
                    <Route path="/" element={<FileUpload />} />
                    <Route path="/wireframe" element={<WireframeAppSample />} />
                    {/* <Route path="/generate-wireframe" element={<WireframeApp />} /> */}
                </Routes>
            </main>
            {/* <Footer /> */}
        </div>
    );
}

export default App;
