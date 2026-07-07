import coupleImage from "../../assets/HomeAssets/couple.png";
import orderUkLogo from "../../assets/HomeAssets/OrderUKLogo.png";
import appStoreBadges from "../../assets/HomeAssets/app-store-badges.png";

/**
 * DownloadBanner
 *
 * Props:
 * - imageSrc (string, required): the couple photo you provide.
 * - imageAlt (string, optional)
 * - appBadgesSrc (string, required): the combined App Store + Google Play
 * badge image you provide (e.g. app-store-badges-en.png).
 * - storeHref (string, optional): since both badges are one image, this
 * single link wraps the whole graphic (defaults to "#").
 */
export default function DownloadBanner({
  imageSrc = coupleImage,
  imageAlt = "Couple ordering on their phones",
  imageLogo = orderUkLogo,
  imageLogoAlt = "Order.uk",
  appBadgesSrc = appStoreBadges,
  appBadgesAlt = "Download on the App Store and Google Play",
  storeHref = "#",
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#EFEFEF] w-full max-w-[1528px] mx-auto mt-8">
      
      
      <div className="flex flex-col lg:flex-row-reverse items-center lg:items-stretch min-h-[300px] lg:min-h-72">
        
        {/* =========================================
            TEXT SECTION (Top on Mobile, Right on Desktop)
        ========================================= */}
        <div className="flex flex-1 w-full lg:w-[50%] flex-col items-center lg:items-start justify-center gap-3 px-4 pt-10 pb-2 lg:py-8 lg:pl-2 lg:pr-10">
          
          <h1 className="flex flex-wrap items-center justify-center lg:justify-start text-3xl font-extrabold text-[#03081F] sm:text-xl lg:text-4xl text-center">
            <img
              src={imageLogo}
              alt={imageLogoAlt}
              className="inline-block h-6 w-auto object-contain sm:h-10 lg:h-12"
            />
            <span>ing is more</span>
          </h1>

          {/* Highlight Text:
            Mobile: Transparent background, black text.
            Desktop: Dark pill background, white text. 
          */}
          <div className="flex items-center justify-center lg:justify-end rounded-full h-auto bg-transparent lg:bg-[#03081F] px-0 lg:px-6 py-1 lg:py-2.5 mt-1 lg:mt-0">
            <span className="text-2xl font-bold text-[#FC8A06] underline decoration-2 underline-offset-2 sm:text-4xl">
              Personalised
            </span>
            <span className="ml-2 text-2xl font-semibold text-[#03081F] lg:text-white sm:text-4xl">
              &amp; Instant
            </span>
          </div>

          <p className="text-sm text-center lg:text-left text-[#03081F]/70 mt-1 lg:mt-0">
            Download the Order.uk app for faster ordering
          </p>

          <a href={storeHref} className="mt-4 lg:mt-1 inline-block w-fit hover:opacity-80 transition-opacity">
            <img
              src={appBadgesSrc}
              alt={appBadgesAlt}
              className="h-10 lg:h-9 w-auto object-contain"
            />
          </a>
        </div>

        {/* =========================================
            IMAGE SECTION (Bottom on Mobile, Left on Desktop)
        ========================================= */}
        <div className="relative w-full lg:w-[50%] flex justify-center lg:justify-start items-end pt-8 lg:pt-6 px-4 lg:pl-8 lg:pr-0">
          <img
            src={imageSrc}
            alt={imageAlt}
            // Tailwind allows arbitrary values for the gradient mask so it only applies to desktop
            className="h-auto w-[85%] sm:w-[60%] lg:w-full object-cover object-top lg:[mask-image:linear-gradient(to_right,black_75%,transparent_100%)] lg:[webkit-mask-image:linear-gradient(to_right,black_75%,transparent_100%)]"
          />
        </div>
        
      </div>
    </section>
  );
}