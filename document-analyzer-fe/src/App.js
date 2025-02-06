import React from 'react';
import Header from './components/header/Header';
import FileUpload from './components/fileupload/FileUpload';
import Footer from './components/footer/Footer';
import './App.css';

function App() {
    return (
        <div className="App">
            <Header />
            <hr className="divider" />
            <main>
                <FileUpload />
            </main>
            <Footer />
        </div>
    );
}

export default App;