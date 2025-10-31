'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface NregaDistrictData {
  district_name: string;
  Total_No_of_JobCards_issued?: number | string;
  Total_No_of_Job_Cards_issued?: number | string;
  Total_No_of_Active_Job_Cards?: number | string;
  Total_No_of_Workers?: number | string;
  Total_No_of_Active_Workers?: number | string;
  Total_Households_Worked?: number | string;
  Total_No_of_HHs_completed_100_Days_of_Wage_Employment?: number | string;
  Number_of_Completed_Works?: number | string;
  Number_of_Ongoing_Works?: number | string;
  [key: string]: any;
}

interface NavIconProps {
  label: string;
  active?: boolean;
  center?: boolean;
  icon: string;
}

type LanguageKey = 'English' | 'Marathi' | 'Hindi';

const districts = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur',
  'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur',
  'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad',
  'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg',
  'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
];

const languages: LanguageKey[] = ['Marathi', 'Hindi', 'English'];

async function translateText(text: string, targetLang: string) {

  const codeMap: { [key: string]: string } = {
    English: 'en',
    Marathi: 'mr',
    Hindi: 'hi',
  };
  if (targetLang === 'English') return text;
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${codeMap[targetLang]}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return data[0][0][0];
  } catch {
    return text;
  }
}

async function reverseGeocode(lat: number, lon: number) {
  const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK') {
      const districtComponent = data.results[0]?.address_components.find((comp: any) => // Added 'any' type to comp
        comp.types.includes('administrative_area_level_2')
      );
      return districtComponent?.long_name || null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function Page() {
  const [view, setView] = useState('welcome');
  const [district, setDistrict] = useState('Pune');
  const [compareDistrict, setCompareDistrict] = useState('Nagpur');
  const [language, setLanguage] = useState('English');
  const [data, setData] = useState<NregaDistrictData | null>(null);
  const [comparisonData, setComparisonData] = useState<NregaDistrictData | null>(null);
  const [t, setT] = useState<{ [key: string]: string }>({});
  const [showComparison, setShowComparison] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupDoneKey, setPopupDoneKey] = useState(0);
  const [languageSelection, setLanguageSelection] = useState('English');
  const [isLoading, setIsLoading] = useState(true);
  const [isCompareLoading, setIsCompareLoading] = useState(true);

  const labels = {
    welcomeTitle: 'NREGA मित्र',
    welcomeDesc: 'Discover the Progress Happening Near You.',
    getStarted: 'Get Started',
    selectDistrict: 'Select District in Maharashtra',
    apply: 'Apply',
    autoLocate: 'Auto Locate My District',
    dashboardSubtitle: 'MGNREGA District Dashboard',
    searchSubtitle: 'Search District',
    aboutSubtitle: 'About NREGA मित्र',
    aboutDesc: 'NREGA मित्र bridges the gap between complex government data and the citizens it serves. This app makes official MGNREGA performance data simple and accessible for everyone in the district, regardless of technical skill or literacy. Our goal is to empower every citizen by helping them understand their district\'s performance and progress, truly enabling \'Our Voice, Our Rights\'.',
    developedBy: 'Developed by ',
    developedByName: 'Darshan Akshay Upadhye',
    insightsSubtitle: 'Maharashtra Insights Overview',
    settingsSubtitle: 'Settings',
    selectLanguage: 'Select Language',
    save: 'Save',
    overview: 'Overview',
    totalWorkers: 'Total Workers Registered',
    total: 'Total',
    women: 'Women',
    men: 'Men',
    dataSummary: 'Data Summary',
    manDays: 'Man-days Generated',
    avgWage: 'Avg Wage/Cycle',
    highlights: 'Project Highlights',
    info: 'Info',
    home: 'Home',
    search: 'Search',
    insights: 'Insights',
    about: 'About',
    settings: 'Settings',
    loading: 'Loading...',
    loadingChart: 'Loading chart...',
    unableLocation: 'Unable to retrieve your location',
    gpsNotSupported: 'Geolocation is not supported by your browser',
    compareDistricts: 'Compare Districts',
    languageChangedSucc: 'Language changed successfully',
    districtSelectedSucc: 'District selected successfully',
  };

  function showPopup(message: string) {
    setPopupMessage(message);
    setPopupDoneKey((prev) => prev + 1);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 2000);
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang && languages.includes(savedLang as LanguageKey)) {
      setLanguage(savedLang);
      setLanguageSelection(savedLang);
    }
  }, []);

  useEffect(() => {
    async function translateAll() {
      let newLabels: { [key: string]: string } = {};
      for (let key of Object.keys(labels)) {
        newLabels[key] = await translateText(labels[key as keyof typeof labels], language);
      }
      setT(newLabels);
    }
    translateAll();
  }, [language]);

  useEffect(() => {
    if (!district) return; 

    async function fetchDistrictData() {
      console.log(`Fetching data for: ${district}`);
      setIsLoading(true); 
      try {
        const res = await fetch(`http://localhost:5000/api/nrega/district/${encodeURIComponent(district)}`);
        
        if (!res.ok) {
          if (res.status === 404) {
             console.warn(`District data not found for: ${district}`);
             setData(null);
          } else {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return;
        }

        const val = await res.json() as NregaDistrictData;
        console.log('Fetched main district data:', val);
        setData(val); 
        setShowComparison(false); 
        
      } catch (error) {
        console.error(`Error fetching data for ${district}:`, error);
        setData(null);
      } finally {
        setIsLoading(false); 
      }
    }

    fetchDistrictData();
  }, [district]); 

  useEffect(() => {
    if (!compareDistrict) return; 

    async function fetchCompareData() {
      console.log(`Fetching comparison data for: ${compareDistrict}`);
      setIsCompareLoading(true); 
      try {
        const res = await fetch(`http://localhost:5000/api/nrega/district/${encodeURIComponent(compareDistrict)}`);
        
        if (!res.ok) {
           if (res.status === 404) {
             console.warn(`Comparison district data not found for: ${compareDistrict}`);
             setComparisonData(null);
           } else {
            throw new Error(`HTTP error! status: ${res.status}`);
           }
           return;
        }

        const val = await res.json() as NregaDistrictData;
        console.log('Fetched comparison district data:', val);
        setComparisonData(val);
        
      } catch (error) {
        console.error(`Error fetching data for ${compareDistrict}:`, error);
        setComparisonData(null);
      } finally {
        setIsCompareLoading(false); 
      }
    }

    fetchCompareData();
  }, [compareDistrict]); 


  const autoLocateDistrict = () => {
    if (!navigator.geolocation) {
      alert(t.gpsNotSupported || labels.gpsNotSupported);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const districtName = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      if (districtName && districts.includes(districtName)) {
        setDistrict(districtName);
        showPopup(t.districtSelectedSucc || labels.districtSelectedSucc);
        setView('dashboard');
      } else {
        alert('Could not determine your district, defaulting to Pune');
        setDistrict('Pune');
        setView('dashboard');
      }
    }, () => alert(t.unableLocation || labels.unableLocation));
  };

  function CircularStat({ value = 0, label = '', color = '#39b98a' }) {
    const size = 72;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(Math.max(value, 0), 100);
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="flex flex-col items-center w-1/3">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#eef2f7"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            fill="none"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="13"
            fill="#0f172a"
            fontWeight="600"
          >
            {pct}%
          </text>
        </svg>
        <div className="text-xs text-slate-500 mt-2 text-center">{label}</div>
      </div>
    );
  }

  const Header = () => {
    let subtitle = '';
    if (view === 'welcome') subtitle = t.welcomeDesc || labels.welcomeDesc;
    else if (view === 'dashboard') subtitle = t.dashboardSubtitle || labels.dashboardSubtitle;
    else if (view === 'search') subtitle = t.searchSubtitle || labels.searchSubtitle;
    else if (view === 'about') subtitle = t.aboutSubtitle || labels.aboutSubtitle;
    else if (view === 'insights') subtitle = t.insightsSubtitle || labels.insightsSubtitle;
    else if (view === 'settings') subtitle = t.settingsSubtitle || labels.settingsSubtitle;

    return (
      <div className="px-4 py-3 bg-gradient-to-r from-[#0f7a7a] to-[#2ba26f] flex items-center gap-3 fixed top-0 left-0 right-0 z-20">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
          <img
            src="/NREGA_Mitra_Icon_White.svg"
            alt="MGNREGA Mitra Logo"
            className="w-15 h-15 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="text-white font-semibold text-lg" style={{ lineHeight: '1.3' }}>
            {t.welcomeTitle || labels.welcomeTitle}
          </div>
          <div className="text-white/80 text-xs">{subtitle}</div>
        </div>
        {(view === 'dashboard' || view === 'search' || view === 'insights') && (
          <div className="flex items-center gap-3">
            <div className="text-white text-xs text-right flex flex-col items-end gap-0.5">
              <div className="font-medium">Maharashtra</div>
              <div
                className="flex items-center gap-1 text-[11px] text-white/80 cursor-pointer"
                title={t.autoLocate || labels.autoLocate}
                onClick={autoLocateDistrict}
              >
                <span>{district}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 hover:text-green-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={view === 'dashboard'
                      ? 'M21 21l-4.35-4.35M3 11a8 8 0 1116 0 8 8 0 01-16 0z'
                      : 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3'}
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  function NavIcon({ label, active = false, center = false, icon = 'home' }: NavIconProps) {
    const iconSet: { [key: string]: React.ReactNode } = {
      home: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? '#0f7a7a' : '#94a3b8'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12L12 5l9 7" />
          <rect x="6" y="12" width="12" height="7" rx="1.5" />
        </svg>
      ),
      search: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? '#0f7a7a' : '#94a3b8'}
          strokeWidth="1.2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
      bar: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="14" width="3" height="6" rx="1" fill="#2ba26f" />
          <rect x="10" y="10" width="3" height="10" rx="1" fill="#7adcb4" />
          <rect x="16" y="6" width="3" height="14" rx="1" fill="#bef0e3" />
        </svg>
      ),
      user: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? '#0f7a7a' : '#94a3b8'}
          strokeWidth="1"
        >
          <circle cx="12" cy="8" r="4" />
          <rect x="6" y="16" width="12" height="5" rx="2.5" />
        </svg>
      ),
      settings: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? '#0f7a7a' : '#94a3b8'}
          strokeWidth="1"
        >
          <circle cx="12" cy="12" r="1.5" />
          <path d="M19.4 15a1.7 1.7 0 00.1-3.4l-1.2-2.1a1.7 1.7 0 00-2.4-.5l-1.6.9a8.3 8.3 0 01-3.5 0l-1.6-.9a1.7 1.7 0 00-2.4.5l-1.2 2.1a1.7 1.7 0 00.1 3.4l1.2 2.1a1.7 1.7 0 002.4.5l1.6-.9a8.3 8.3 0 013.5 0l1.6.9a1.7 1.7 0 002.4-.5l1.2-2.1z" />
        </svg>
      ),
    };

    if (view === 'welcome') {
      return (
        <div className="flex-1 flex items-center justify-center cursor-not-allowed" style={{ opacity: '0.5' }}>
          <div className={`p-2 rounded-full bg-transparent`}>{iconSet[icon]}</div>
          <div className="text-[11px] text-slate-400 mt-1">{t[label.toLowerCase()] || label}</div>
        </div>
      );
    }

    return (
      <div
        className={`flex-1 flex-col ${center ? 'flex items-center justify-center' : 'flex items-center justify-center'}`}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          if (label.toLowerCase() === 'home') setView('dashboard');
          else if (label.toLowerCase() === 'search') setView('search');
          else if (label.toLowerCase() === 'insights') setView('insights');
          else if (label.toLowerCase() === 'about') setView('about');
          else if (label.toLowerCase() === 'settings') setView('settings');
        }}
      >
        <div className={`p-2 rounded-full ${active ? 'bg-slate-100' : 'bg-transparent'}`}>
          {iconSet[icon]}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">{t[label.toLowerCase()] || label}</div>
      </div>
    );
  }

  const WelcomeSection = () => (
    <div className="flex flex-col items-center text-center px-6 py-6 space-y-2">
      <img
        src="/Welcome_Illutration_01.svg"
        alt="Welcome"
        className="mx-auto max-w-full h-auto"
        style={{ marginBottom: '-15px' }}
      />
      <h1 className="text-2xl font-semibold text-[#0f7a7a]" style={{ marginBottom: '6px' }}>
        {t.welcomeTitle || labels.welcomeTitle}
      </h1>
      <p className="text-sm text-slate-600 max-w-xs mx-auto" style={{ marginBottom: '10px' }}>
        {t.welcomeDesc || labels.welcomeDesc}
      </p>
      <button
        className="bg-gradient-to-r from-[#0f7a7a] to-[#2ba26f] text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 text-sm"
        style={{ margin: '8px 0' }}
        onClick={() => setView('search')}
      >
        {t.getStarted || labels.getStarted}
      </button>
    </div>
  );

  const SearchSection = () => (
    <div className="p-4 space-y-3 flex flex-col">
      <img
        src="/Search_Illutration.svg"
        alt="Search"
        className="mx-auto max-w-full h-auto"
        style={{ marginBottom: '-30px' }}
      />
      <div className="flex flex-col space-y-2">
        <label htmlFor="district" className="text-slate-700 font-semibold text-sm">
          {t.selectDistrict || labels.selectDistrict}
        </label>
        <select
          id="district"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <button
          className="bg-gradient-to-r from-[#0f7a7a] to-[#2ba26f] text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 text-sm"
          style={{ margin: '8px 0' }}
          onClick={() => {
            setView('dashboard');
            showPopup(t.districtSelectedSucc || labels.districtSelectedSucc);
          }}
        >
          {t.apply || labels.apply}
        </button>
        <button
          onClick={autoLocateDistrict}
          style={{ marginTop: '2px' }}
          className="bg-gradient-to-r from-[#0f7a7a] to-[#2ba26f] text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 text-sm"
        >
          {t.autoLocate || labels.autoLocate}
        </button>
      </div>
    </div>
  );

  const AboutSection = () => (
    <div className="p-6 space-y-3 text-center">
      <img
        src="/NREGA_Mitra_Logo.svg"
        alt="About"
        className="mx-auto max-w-full h-auto"
        style={{ marginBottom: '-15px' }}
      />
      <h2 className="text-lg font-semibold text-[#0f7a7a]" style={{ marginBottom: '3px' }}>
        {t.aboutSubtitle || labels.aboutSubtitle}
      </h2>
      <p className="text-sm text-slate-600 max-w-md mx-auto" style={{ marginBottom: '8px' }}>
        {t.aboutDesc || labels.aboutDesc}
      </p>
      <div className="text-xs text-slate-400">
        {t.developedBy || labels.developedBy}
        <a
          href="https://www.linkedin.com/in/darshan-upadhye-02a9a5287/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-700"
        >
          {t.developedByName || labels.developedByName}
        </a>
      </div>
    </div>
  );

  const InsightsSection = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-500">{t.loading || labels.loading}</div>
        </div>
      );
    }
    
    if (!data) {
       return (
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-500">No data found for {district}.</div>
        </div>
      );
    }
    
    const keys = Object.keys(data).filter(k => k !== 'district_name');
    const keyLabels = keys.map((key) => ({
      key,
      label: key.replace(/_/g, ' '),
    }));
    const comparisonKeys = keyLabels;

    return (
      <div className="p-4 rounded-lg overflow-hidden shadow-sm bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-slate-700 font-semibold">{t.insightsSubtitle || labels.insightsSubtitle}</div>
          {showComparison ? (
            <button
              onClick={() => setShowComparison(false)}
              aria-label="Close Comparison"
              className="text-red-600 hover:text-red-800 font-bold text-xl leading-none cursor-pointer"
              style={{ lineHeight: 1 }}
            >
              &times;
            </button>
          ) : (
            <select
              className="border border-gray-300 rounded-md p-1 text-sm"
              value={compareDistrict}
              onChange={(e) => setCompareDistrict(e.target.value)}
            >
              {districts.filter(d => d !== district).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}
          {!showComparison && (
            <button
              onClick={() => setShowComparison(true)}
              className="ml-2 px-3 py-1 rounded-md text-white bg-green-600 hover:bg-green-700 text-xs"
            >
              {t.compareDistricts || labels.compareDistricts}
            </button>
          )}
        </div>

        {!showComparison && (
          <div>
            <div className="text-xs text-slate-400 mb-2">District: {data.district_name}</div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
              {Object.entries(data).map(([key, value]: [string, any]) => {
                if (['district_name'].includes(key)) return null;
                return (
                  <div key={key} className="flex justify-between border-b border-slate-200 py-1">
                    <div className="capitalize">{key.replace(/_/g, ' ')}</div>
                    <div className="font-semibold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showComparison && isCompareLoading && (
           <div className="flex justify-center items-center h-40">
              <div className="text-slate-500">{t.loadingChart || labels.loadingChart}</div>
            </div>
        )}
        
        {showComparison && !isCompareLoading && !comparisonData && (
           <div className="flex justify-center items-center h-40">
              <div className="text-slate-500">No data found for {compareDistrict}.</div>
            </div>
        )}

        {showComparison && !isCompareLoading && data && comparisonData && (
          <div className="max-h-[60vh] overflow-y-auto border border-gray-200 rounded p-3">
            <div className="grid grid-cols-3 gap-4 text-sm text-slate-700 font-medium border-b border-gray-300 pb-1">
              <div>Metric</div>
              <div className="text-center">{data.district_name}</div>
              <div className="text-center">{comparisonData.district_name}</div>
            </div>
            {comparisonKeys.map(({ key, label }) => (
              <div key={key} className="grid grid-cols-3 gap-4 text-sm text-slate-700 border-b border-gray-100 py-1">
                <div>{label}</div>
                <div className="text-center font-semibold">{typeof data[key] === 'number' ? data[key].toLocaleString() : data[key]}</div>
                <div className="text-center font-semibold">{typeof comparisonData[key] === 'number' ? comparisonData[key].toLocaleString() : comparisonData[key]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SettingsSection = () => (
    <div className="p-6 space-y-4 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold text-[#0f7a7a] mb-4">{t.settingsSubtitle || labels.settingsSubtitle}</h2>
      <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
        {t.selectLanguage || labels.selectLanguage}
      </label>
      <select
        id="language-select"
        value={languageSelection}
        onChange={(e) => setLanguageSelection(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full"
      >
        {languages.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
      <button
        className="bg-gradient-to-r from-[#0f7a7a] to-[#2ba26f] text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 text-sm"
        onClick={() => {
          setLanguage(languageSelection);
          localStorage.setItem('appLanguage', languageSelection);
          showPopup(t.languageChangedSucc || labels.languageChangedSucc);
        }}
      >
        {t.save || labels.save}
      </button>
    </div>
  );

  const HomeSection = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-500">{t.loading || labels.loading}</div>
        </div>
      );
    }
    
    if (!data) {
       return (
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-500">No data found for {district}.</div>
        </div>
      );
    }

    const totalJobCardsIssued = Number(data?.Total_No_of_JobCards_issued || data?.Total_No_of_Job_Cards_issued || 0);
    const totalActiveJobCards = Number(data?.Total_No_of_Active_Job_Cards || 0);
    const totalWorkers = Number(data?.Total_No_of_Workers || 0);
    const totalActiveWorkers = Number(data?.Total_No_of_Active_Workers || 0);
    const totalHHWorked = Number(data?.Total_Households_Worked || 0);
    const totalHHCompleted100Days = Number(data?.Total_No_of_HHs_completed_100_Days_of_Wage_Employment || 0);

    const pctActiveJobCards = totalJobCardsIssued > 0 
      ? (totalActiveJobCards / totalJobCardsIssued) * 100 
      : 0;
      
    const pctActiveWorkers = totalWorkers > 0 
      ? (totalActiveWorkers / totalWorkers) * 100 
      : 0;
      
    const pctHHCompleted100Days = totalHHWorked > 0 
      ? (totalHHCompleted100Days / totalHHWorked) * 100 
      : 0;

    const circularStats = [
      {
        value: Math.round(pctActiveJobCards),
        label: 'Active Job Cards',
        color: '#0f7a7a',
      },
      {
        value: Math.round(pctActiveWorkers),
        label: 'Active Workers',
        color: '#2ba26f',
      },
      {
        value: Math.round(pctHHCompleted100Days),
        label: 'HH Completed 100 Days',
        color: '#66c2f1',
      },
    ];

    const worksData = [
      { name: 'Completed', value: Number(data.Number_of_Completed_Works || 0) },
      { name: 'Ongoing', value: Number(data.Number_of_Ongoing_Works || 0) },
    ];

    const keyLabels = Object.keys(data)
      .filter(k => k !== 'district_name')
      .map(k => ({ key: k, label: k.replace(/_/g, ' ') }));

    return (
      <div>
        <div className="rounded-lg p-3 bg-gradient-to-b from-sky-50 to-white shadow-sm mb-2 text-slate-700 font-semibold text-base">
          Job Cards
        </div>
        <div className="rounded-lg p-3 bg-gradient-to-b from-sky-50 to-white shadow-sm mb-4 grid grid-cols-3 gap-3">
          {circularStats.map(({ value, label, color }) => (
            <CircularStat
              key={label}
              value={value}
              label={label}
              color={color}
            />
          ))}
        </div>

        <div className="rounded-lg overflow-hidden shadow-sm mb-4">
          <div className="p-3 bg-gradient-to-b from-green-50 to-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-700 font-semibold">Number of Works</div>
            </div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={worksData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" barSize={8} fill="#2ba26f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-3 bg-gradient-to-b from-green-50 to-white shadow-sm max-h-[46vh] overflow-y-auto">
          <div className="text-slate-700 font-semibold mb-2">{t.dataSummary || labels.dataSummary}</div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
            {keyLabels.map(({ key, label }) => (
              <div key={key} className="flex justify-between border-b border-slate-200 pb-1">
                <div className="capitalize">{label}</div>
                <div className="font-semibold">{typeof data[key] === 'number' ? data[key].toLocaleString() : data[key]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Popup = () => (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg px-5 py-3 shadow-lg flex items-center gap-3 transition-opacity duration-500 ${popupVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ zIndex: 40 }}
    >
      <img
        key={popupDoneKey}
        src="/Done.svg"
        alt="Done"
        className="w-10 h-10 animate-bounce"
      />
      <span className="text-sm font-semibold text-green-600">{popupMessage}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50" style={{ height: '100vh' }}>
      <Header />
      <div className="flex-1 overflow-y-auto bg-white p-4" style={{ paddingTop: 72, paddingBottom: 56 }}>
        {view === 'welcome' && <WelcomeSection />}
        {view === 'dashboard' && <HomeSection />}
        {view === 'search' && <SearchSection />}
        {view === 'about' && <AboutSection />}
        {view === 'insights' && <InsightsSection />}
        {view === 'settings' && <SettingsSection />}
      </div>
      <div
        className="bg-white p-2 flex items-center justify-between shadow-sm rounded-t-xl fixed bottom-0 left-0 right-0 z-20"
        style={{ height: '56px' }}
      >
        <NavIcon label={labels.home} active={view === 'dashboard'} icon="home" />
        <NavIcon label={labels.search} active={view === 'search'} icon="search" />
        <NavIcon label={labels.insights} active={view === 'insights'} center icon="bar" />
        <NavIcon label={labels.about} active={view === 'about'} icon="user" />
        <NavIcon label={labels.settings} active={view === 'settings'} icon="settings" />
      </div>

      <Popup />
    </div>
  );
}