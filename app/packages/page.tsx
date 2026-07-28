'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import styles from './page.module.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

interface CorePackage {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  ctaSubject: string;
  subtitle: string;
  features: string[];
  popular?: boolean;
  bestValue?: boolean;
}

interface AddOnPackage {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  ctaSubject: string;
  description: string;
}

const corePackages: CorePackage[] = [
  { 
    id: 1, 
    name: "1. The Basic Reveal", 
    price: "₹4,500", 
    priceValue: 4500,
    ctaSubject: "Inquiry: The Basic Reveal Package",
    subtitle: "Entry tier",
    features: [
      "1 vertical reel, shot and edited at the showroom",
      "Covers the key handover moment · delivered same day",
      "Shot on premium iPhone by default"
    ]
  },
  { 
    id: 2, 
    name: "2. The Reveal Plus", 
    price: "₹5,800", 
    priceValue: 5800,
    ctaSubject: "Inquiry: The Reveal Plus Package",
    subtitle: "+ everything in Basic Reveal",
    features: [
      "5 additional digital photos from the showroom session"
    ]
  },
  { 
    id: 3, 
    name: "3. The Journey Home", 
    price: "₹6,500", 
    priceValue: 6500,
    ctaSubject: "Inquiry: The Journey Home Package",
    subtitle: "+ everything in Reveal Plus",
    popular: true,
    features: [
      "A second reel at home — arrival or pooja moment · 2 reels total"
    ]
  },
  { 
    id: 4, 
    name: "4. The Extended Drive", 
    price: "₹10,500", 
    priceValue: 10500,
    ctaSubject: "Inquiry: The Extended Drive Package",
    subtitle: "+ everything in Journey Home",
    features: [
      "Private link to all raw, unedited footage from both shoots"
    ]
  },
  { 
    id: 5, 
    name: "5. The Cinematic Drive", 
    price: "₹12,000", 
    priceValue: 12000,
    ctaSubject: "Inquiry: The Cinematic Drive Package",
    subtitle: "+ everything in Extended Drive",
    bestValue: true,
    features: [
      "Full cinematic film, graded and scored, with highway/open-road shots"
    ]
  },
  { 
    id: 6, 
    name: "6. The Ultimate Flex", 
    price: "₹15,000", 
    priceValue: 15000,
    ctaSubject: "Inquiry: The Ultimate Flex Package",
    subtitle: "+ everything in Cinematic Drive",
    features: [
      "Aerial drone shots (DGCA-licensed operators) · 15 color-graded candid photos"
    ]
  },
];

const addOns: AddOnPackage[] = [
  { id: 1, name: "Extra edited reel", price: "₹1,500", priceValue: 1500, ctaSubject: "Add-on: Extra edited reel", description: "New cut, same footage" },
  { id: 2, name: "Extra photo pack", price: "₹1,000", priceValue: 1000, ctaSubject: "Add-on: Extra photo pack", description: "+10 candids" },
  { id: 3, name: "Raw footage / RAW files", price: "₹1,800", priceValue: 1800, ctaSubject: "Add-on: Raw footage", description: "Full unedited handover" },
  { id: 4, name: "Drone shoot", price: "₹3,000", priceValue: 3000, ctaSubject: "Add-on: Drone shoot", description: "Aerial shots, any package · DGCA-licensed" },
  { id: 5, name: "Private / unbranded video", price: "₹500", priceValue: 500, ctaSubject: "Add-on: Private / unbranded video", description: "No watermark, no repost" },
];

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState<number>(3); // Default to The Journey Home (id: 3)
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  
  // Camera upgrade states
  const [cameraUpgradeToggled, setCameraUpgradeToggled] = useState<boolean>(false);
  const [cameraUpgradeCount, setCameraUpgradeCount] = useState<number>(0);
  const [comments, setComments] = useState<string>('');

  const handleToggleAddOn = (id: number) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentPackage = corePackages.find(p => p.id === selectedPackage) || corePackages[2];
  const isTier1to3 = currentPackage.id <= 3;

  // Calculate Camera Upgrade Cost
  let cameraUpgradeCost = 0;
  if (isTier1to3) {
    cameraUpgradeCost = cameraUpgradeToggled ? 4000 : 0;
  } else {
    if (cameraUpgradeCount === 1) {
      cameraUpgradeCost = 6000;
    } else if (cameraUpgradeCount > 1) {
      cameraUpgradeCost = 6000 + (cameraUpgradeCount - 1) * 4000;
    }
  }
  
  const totalCost = currentPackage.priceValue + cameraUpgradeCost + selectedAddOns.reduce((acc, addonId) => {
    const addon = addOns.find(a => a.id === addonId);
    return acc + (addon ? addon.priceValue : 0);
  }, 0);

  const getCustomWhatsappLink = () => {
    let text = `Hi Apisomi team,\n\nI would like to inquire about booking the following custom configuration:\n\n`;
    text += `*Base Package:* ${currentPackage.name.slice(3)} (${currentPackage.price})\n`;
    
    if (cameraUpgradeCost > 0) {
      text += `*Camera Upgrade:* ${isTier1to3 ? 'Flat Upgrade (1 Camera)' : `${cameraUpgradeCount} Camera Upgrade(s)`} (+₹${cameraUpgradeCost.toLocaleString('en-IN')})\n`;
    }
    
    if (selectedAddOns.length > 0) {
      text += `*Selected Add-ons:*\n`;
      selectedAddOns.forEach(id => {
        const ad = addOns.find(a => a.id === id);
        if (ad) {
          text += `- ${ad.name} (${ad.price})\n`;
        }
      });
    }
    text += `\n*Total Estimated Price:* ₹${totalCost.toLocaleString('en-IN')}\n\n`;
    
    if (comments.trim()) {
      text += `*Special Requests / Notes:*\n${comments.trim()}\n\n`;
    }
    
    text += `Please share more details on availability and scheduling.`;
    
    return `https://wa.me/919977994060?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className={`${styles.page} ${poppins.variable}`}>
      {/* Background Decorative Mesh Glows */}
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />

      {/* Navigation Header */}
      <header className={styles.navHeader}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div className={styles.logoSlot}>
              <img src="/logo.png" alt="Apisomi Logo" className={styles.logoImage} />
            </div>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/" className={styles.headerLink}>
              Portfolio
            </Link>
            <div className={styles.socialNav}>
              <a href="mailto:hello@apisomi.com" className={styles.socialLink} aria-label="Email Apisomi">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
              <a href="https://www.instagram.com/apisomi_global/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Apisomi Instagram profile">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4.000 4.000 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Packages Layout Area */}
      <main className="container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        
        {/* Intro Hero Section */}
        <section className={styles.introHero}>
          <h1 className={styles.title}>Service Tiers & Add-ons</h1>
          <p className={styles.subtitle}>
            Premium pricing packages and commercial creation tiers crafted for elite dealerships and automotive brands.
          </p>
        </section>

        {/* Section 1: Core Tiers Grid */}
        <section className={styles.packageSection}>
          <h2 className={styles.tableTitle}>Core packages</h2>
          <div className={styles.packageGrid}>
            {corePackages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <div 
                  key={pkg.id} 
                  className={`${styles.packageCard} ${pkg.popular ? styles.popularCard : ''} ${pkg.bestValue ? styles.bestValueCard : ''} ${isSelected ? styles.selectedCard : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && <span className={styles.popularBadge}>Most popular</span>}
                  {pkg.bestValue && <span className={styles.bestValueBadge}>Best value</span>}
                  <div className={styles.cardHeader}>
                    <h3 className={styles.packageName}>{pkg.name}</h3>
                    <span className={styles.packagePrice}>{pkg.price}</span>
                  </div>
                  <span className={styles.packageSubtitleText}>{pkg.subtitle}</span>
                  
                  <ul className={styles.featuresList}>
                    {pkg.features.map((feat, i) => (
                      <li key={i} className={styles.featureItem}>
                        <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.cardFooter}>
                    <button className={`${styles.selectButton} ${isSelected ? styles.selectedButtonActive : ''}`}>
                      {isSelected ? 'Selected' : 'Select Tier'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Builder & Calculator */}
        <section className={styles.packageSection} style={{ marginTop: '80px' }}>
          <h2 className={styles.tableTitle}>Customise & Calculate</h2>
          
          <div className={styles.calculatorSection}>
            <div className={styles.addOnsSelector}>
              
              {/* Camera Upgrade Panel */}
              <div className={styles.cameraUpgradeBox}>
                <h3 className={styles.calculatorSubTitle}>Camera upgrade (iPhone → videography camera)</h3>
                
                {isTier1to3 ? (
                  <div 
                    className={`${styles.addOnCard} ${cameraUpgradeToggled ? styles.addOnCardSelected : ''}`}
                    onClick={() => setCameraUpgradeToggled(prev => !prev)}
                  >
                    <div className={styles.checkboxWrapper}>
                      <div className={`${styles.customCheckbox} ${cameraUpgradeToggled ? styles.checked : ''}`}>
                        {cameraUpgradeToggled && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className={styles.addOnDetails}>
                      <span className={styles.addOnName}>Flat upgrade (1 camera)</span>
                      <p className={styles.addOnDesc}>Upgrades production from iPhone to professional camera setup for Packages 1–3.</p>
                    </div>
                    <span className={styles.addOnPrice}>+₹4,000</span>
                  </div>
                ) : (
                  <div className={styles.cameraCounterCard}>
                    <div className={styles.cameraCounterDetails}>
                      <span className={styles.addOnName}>Professional Camera Upgrades</span>
                      <p className={styles.addOnDesc}>
                        {cameraUpgradeCount === 0 
                          ? "Using default premium iPhone setup." 
                          : `Configured with ${cameraUpgradeCount} upgraded professional camera${cameraUpgradeCount > 1 ? 's' : ''}.`}
                      </p>
                    </div>
                    
                    <div className={styles.counterControlWrapper}>
                      <button 
                        className={styles.counterButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCameraUpgradeCount(prev => Math.max(0, prev - 1));
                        }}
                        disabled={cameraUpgradeCount === 0}
                      >
                        −
                      </button>
                      <span className={styles.counterValue}>{cameraUpgradeCount}</span>
                      <button 
                        className={styles.counterButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCameraUpgradeCount(prev => prev + 1);
                        }}
                      >
                        +
                      </button>
                      
                      {cameraUpgradeCount > 0 && (
                        <span className={styles.counterPriceTag}>
                          +₹{cameraUpgradeCost.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Add-ons List */}
              <div className={styles.addOnsWrapper} style={{ marginTop: '40px' }}>
                <h3 className={styles.calculatorSubTitle}>Add-ons</h3>
                <p className={styles.calculatorDesc}>Enhance your shoot with specialized visual deliverables.</p>
                
                <div className={styles.addOnsList}>
                  {addOns.map((addon) => {
                    const isToggled = selectedAddOns.includes(addon.id);
                    return (
                      <div 
                        key={addon.id} 
                        className={`${styles.addOnCard} ${isToggled ? styles.addOnCardSelected : ''}`}
                        onClick={() => handleToggleAddOn(addon.id)}
                      >
                        <div className={styles.checkboxWrapper}>
                          <div className={`${styles.customCheckbox} ${isToggled ? styles.checked : ''}`}>
                            {isToggled && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className={styles.addOnDetails}>
                          <span className={styles.addOnName}>{addon.name}</span>
                          <p className={styles.addOnDesc}>{addon.description}</p>
                        </div>
                        <span className={styles.addOnPrice}>{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className={styles.summaryStickyBox}>
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>Est. Booking Summary</h3>
                
                <div className={styles.summaryLine}>
                  <span className={styles.summaryLabel}>Base ({currentPackage.name.slice(3)})</span>
                  <span className={styles.summaryValue}>{currentPackage.price}</span>
                </div>

                {cameraUpgradeCost > 0 && (
                  <div className={styles.summaryLineSub}>
                    <span className={styles.summaryLabelSub}>
                      + Camera Upgrade ({isTier1to3 ? "Flat 1-cam" : `${cameraUpgradeCount} Camera${cameraUpgradeCount > 1 ? 's' : ''}`})
                    </span>
                    <span className={styles.summaryValueSub}>
                      ₹{cameraUpgradeCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                
                {selectedAddOns.length > 0 && (
                  <div className={styles.summaryAddOnsList}>
                    {selectedAddOns.map(id => {
                      const ad = addOns.find(a => a.id === id);
                      if (!ad) return null;
                      return (
                        <div key={id} className={styles.summaryLineSub}>
                          <span className={styles.summaryLabelSub}>+ {ad.name}</span>
                          <span className={styles.summaryValueSub}>{ad.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Custom Booking Comments Section */}
                <div className={styles.commentSection}>
                  <label htmlFor="booking-comments" className={styles.commentLabel}>
                    Special Requests / Notes
                  </label>
                  <textarea
                    id="booking-comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Preferred dates, locations, or special requests..."
                    className={styles.commentInput}
                    rows={3}
                  />
                </div>

                <div className={styles.summaryDivider} />
                
                <div className={styles.totalLine}>
                  <span className={styles.totalLabel}>Total Estimate</span>
                  <span className={styles.totalValue}>₹{totalCost.toLocaleString('en-IN')}</span>
                </div>
                
                <a 
                  href={getCustomWhatsappLink()}
                  className={styles.bookingCTA}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Confirm & Inquiry via WhatsApp</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '8px' }}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <p className={styles.ctaFootnote}>Calculations exclude local production travel costs if outside standard coverage zones.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogoSlot}>
                <img src="/logo.png" alt="Apisomi Logo" className={styles.footerLogoImage} />
              </div>
              <p className={styles.copyright}>
                &copy; 2026 Apisomi. All rights reserved.
              </p>
            </div>
            <div className={styles.footerContact}>
              <a href="mailto:hello@apisomi.com" className={styles.contactTextLink}>
                hello@apisomi.com
              </a>
              <span className={styles.contactDivider}>•</span>
              <a href="tel:9977994060" className={styles.contactTextLink}>
                +91 9977994060
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
