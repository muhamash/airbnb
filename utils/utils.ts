import crypto from 'crypto';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function formatDate ( dateString: string ): Promise<string>
{
    const date = new Date(dateString);

    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();

    const getOrdinalSuffix = (day: number): string => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const dayWithSuffix = day + getOrdinalSuffix(day);
    return `${dayWithSuffix} ${month} ${year}`;
}

export const calculateDaysBetween = async ( checkIn: string, checkOut: string ): number =>
{
    const checkInDate = new Date( checkIn );
    const checkOutDate = new Date( checkOut );
    const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
    
    return differenceInTime / ( 1000 * 60 * 60 * 24 );
};

export const updateSearchParams = async ( updates: Record<string, string | null>, searchParams:URLSearchParams, router: AppRouterInstance ) =>
  {
    const currentParams = new URLSearchParams( searchParams.toString() );
    for ( const key in updates )
    {
      if ( updates[ key ] !== null )
      {
        currentParams.set( key, updates[ key ]! );
      } else
      {
        currentParams.delete( key );
      }
    }
    router.replace( `?${ currentParams.toString() }` );
};

export async function generateHtml (content: { checkIn: string; checkOut: string; rate: number; rentCount: number },
  language: string,
  qrCodeData: string ) : Promise<string>
{
  // console.log( language, content );
  const days: number = await calculateDaysBetween(content.checkIn, content.checkOut);
  const calculatePrice: number = content.rate * content.rentCount * days;
  const total: number = calculatePrice + 17.5 + 51.31;
  
    return `<html>
<head>
    <title>${ language?.invoice?.head }</title>
    <style>
        body {
            background-color: #A0A0A0;
            font-family: Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            position: relative;
            width: 892px;
            height: 1262px;
            margin: 0 auto;
        }
        h1, h2, h3, p {
            margin: 0;
            padding: 0;
        }
        .section {
            margin-bottom: 20px;
            padding: 0 40px 0 40px;
        }
        .header h1 {
            font-size: 25px;
            color: #ffffff;
        }
        .header p {
            font-size: 13px;
            color: #ffffff;
        }
        .section h2 {
            font-size: 22px;
            color: #297c7b;
        }
        .section p {
            font-size: 16px;
            
        }
        .payment p {
            font-size: 11px;
            color: #ffffff;
        }
        .total {
            font-size: 11px;
            color: #ffffff;
            font-weight: bold;
        }
        .contact p {
            font-size: 10px;
        }

        .gradient-qr {
            border-radius: 8px;
            width: 100px;
            height: 100px;
            padding: 5px;
            margin: 3px;
            display: flex;
            background: linear-gradient(45deg, cyan, skyblue, green, pink);
            -webkit-mask-image: url('data:image/png;base64,[Base64-QR-Code]');
            -webkit-mask-size: cover;
            mask-image: url('data:image/png;base64,[Base64-QR-Code]');
            mask-size: cover;
        }

        .header{
            display: flex;
            background-color: teal;
            padding: 0 40px 0 40px;
            margin: 0;
            align-items: center;
            justify-content: space-between;
        }
    </style>
</head>
<body style="background-color: #f3f3f3;">
    <div class="container">
        <div class="header">
            <svg style="padding: 0; margin:0; width:fit-content" width="100" height="200" viewBox="0 0 634 209" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="9" width="181" height="181" rx="15" fill="teal"/>
                <rect x="10" y="9" width="181" height="181" rx="15" stroke="orange" stroke-width="6"/>
                <path d="M138.987 149.896C134.419 153.525 128.475 156.341 121.153 158.343C113.832 160.345 104.822 161.347 94.1216 161.347C83.4841 161.347 72.1582 160.377 60.144 158.437V34.7285C72.2834 32.7887 82.7958 31.8188 91.6812 31.8188C100.629 31.8188 107.95 32.6635 113.645 34.353C119.401 36.0425 124.094 38.3264 127.724 41.2048C134.857 46.7739 138.424 54.0012 138.424 62.8867C138.424 71.7096 135.201 79.0307 128.756 84.8501C136.39 87.2279 142.303 91.7332 146.496 98.366C150.313 104.311 152.221 110.912 152.221 118.171C152.221 125.367 151.158 131.53 149.03 136.661C146.965 141.792 143.617 146.204 138.987 149.896ZM85.0171 81.3772C87.6452 81.8152 90.9303 82.0342 94.8725 82.0342C98.8146 82.0342 102.037 81.5336 104.54 80.5325C107.106 79.4687 109.077 78.1547 110.453 76.5903C112.706 74.0248 113.832 70.4581 113.832 65.8902C113.832 56.3164 108.201 51.5295 96.9374 51.5295C92.1818 51.5295 88.2084 51.7172 85.0171 52.0927V81.3772ZM98.9085 101.463C93.6523 101.463 89.0218 101.808 85.0171 102.496V139.383C89.3973 140.509 93.9965 141.073 98.8146 141.073C103.633 141.073 107.857 140.509 111.486 139.383C115.178 138.194 118.275 136.599 120.778 134.596C125.847 130.466 128.381 125.21 128.381 118.828C128.381 107.251 118.557 101.463 98.9085 101.463Z" fill="white"/>
                <path d="M228.3 74.7001C225.65 74.5345 222.503 74.4517 218.86 74.4517H217.535V19.1804C219.246 19.3184 220.461 19.3874 221.178 19.3874H222.876C225.056 19.3874 226.864 19.277 228.3 19.0562V41.1233H247.758V19.1804C250.049 19.3184 252.271 19.3874 254.424 19.3874C256.605 19.3874 257.971 19.277 258.523 19.0562V74.7001C257.198 74.5345 254.576 74.4517 250.657 74.4517H247.758V51.0597H228.3V74.7001ZM274.499 53.047C274.499 50.0109 275.01 47.1128 276.031 44.3526C277.08 41.5649 278.57 39.136 280.502 37.0659C284.725 32.5946 290.204 30.3589 296.939 30.3589C303.646 30.3589 308.973 32.4703 312.92 36.6933C316.701 40.7231 318.592 45.9535 318.592 52.3846C318.592 58.8157 316.646 64.1427 312.754 68.3657C308.642 72.837 303.19 75.0727 296.4 75.0727C289.39 75.0727 283.897 72.8784 279.923 68.4899C276.307 64.4877 274.499 59.3401 274.499 53.047ZM284.56 52.7986C284.56 54.5375 284.849 56.2211 285.429 57.8496C286.009 59.4781 286.837 60.8719 287.913 62.0312C290.204 64.5429 293.213 65.7987 296.939 65.7987C300.389 65.7987 303.108 64.5705 305.095 62.114C307.027 59.7403 307.993 56.649 307.993 52.84C307.993 48.9758 306.999 45.8569 305.012 43.4832C302.887 40.9439 299.975 39.6743 296.276 39.6743C292.522 39.6743 289.583 41.0267 287.458 43.7316C285.526 46.2157 284.56 49.2381 284.56 52.7986ZM351.543 65.3433C355.103 65.3433 357.546 64.4187 358.871 62.5694H359.202L359.326 72.1746C357.974 73.5271 355.462 74.4241 351.791 74.8657C350.797 75.0037 349.555 75.0727 348.065 75.0727C346.602 75.0727 345.001 74.7967 343.262 74.2447C341.551 73.6927 340.088 72.7956 338.874 71.5536C336.362 68.9867 335.106 64.9707 335.106 59.5057V40.7093H328.854C328.827 39.9089 328.813 39.0946 328.813 38.2666V31.8907C328.813 31.4215 328.827 31.1869 328.854 31.1869H335.106V19.3874H345.25V31.1869H356.635V40.7093H345.25V57.6012C345.25 61.9346 346.45 64.4049 348.851 65.0121C349.624 65.2329 350.521 65.3433 351.543 65.3433ZM370.789 53.1712C370.789 49.9419 371.341 46.9472 372.445 44.187C373.55 41.4269 375.109 39.0118 377.124 36.9417C381.43 32.5532 387.06 30.3589 394.016 30.3589C399.895 30.3589 404.615 32.3047 408.175 36.1965C411.681 39.9503 413.433 44.6701 413.433 50.3559C413.433 52.5364 413.268 54.0269 412.936 54.8273C410.176 55.6001 404.559 55.9865 396.086 55.9865H381.512C382.23 58.9399 383.9 61.2446 386.522 62.9006C389.144 64.5291 392.553 65.3433 396.748 65.3433C401.137 65.3433 404.904 64.5567 408.051 62.9834C408.879 62.5694 409.5 62.183 409.914 61.8242C409.859 62.9834 409.79 64.1703 409.707 65.3847L409.252 71.8434C407.154 73.2787 403.759 74.2723 399.067 74.8243C397.687 74.9899 396.362 75.0727 395.092 75.0727C388.082 75.0727 382.285 73.0302 377.704 68.9453C373.094 64.8327 370.789 59.5747 370.789 53.1712ZM402.42 47.9546C401.289 42.0203 398.059 39.0532 392.732 39.0532C388.537 39.0532 385.349 40.8611 383.169 44.4769C382.506 45.5809 381.995 46.7953 381.637 48.1202C382.299 48.1478 383.113 48.1754 384.079 48.203H387.143C388.164 48.2306 389.144 48.2444 390.083 48.2444H392.443C393.85 48.2444 395.23 48.2306 396.583 48.203L399.978 48.0788C400.888 48.0512 401.703 48.0098 402.42 47.9546ZM437.151 69.8147C437.151 72.1884 437.207 73.7341 437.317 74.4517H426.801V12.7631H437.151V69.8147Z" fill="violet"/>
                <path d="M263.194 162.859C260.636 164.891 257.307 166.468 253.207 167.589C249.107 168.711 244.061 169.271 238.069 169.271C232.112 169.271 225.769 168.728 219.041 167.642V98.364C225.839 97.2777 231.726 96.7345 236.702 96.7345C241.713 96.7345 245.813 97.2076 249.002 98.1537C252.226 99.0998 254.854 100.379 256.886 101.991C260.881 105.11 262.878 109.157 262.878 114.133C262.878 119.074 261.074 123.174 257.464 126.433C261.74 127.764 265.051 130.287 267.399 134.002C269.536 137.331 270.605 141.028 270.605 145.092C270.605 149.122 270.009 152.574 268.818 155.447C267.662 158.321 265.787 160.791 263.194 162.859ZM232.97 124.488C234.442 124.733 236.282 124.856 238.489 124.856C240.697 124.856 242.501 124.575 243.903 124.015C245.34 123.419 246.444 122.683 247.215 121.807C248.476 120.37 249.107 118.373 249.107 115.815C249.107 110.453 245.953 107.773 239.646 107.773C236.982 107.773 234.757 107.878 232.97 108.088V124.488ZM240.749 135.736C237.806 135.736 235.213 135.929 232.97 136.314V156.972C235.423 157.602 237.999 157.918 240.697 157.918C243.395 157.918 245.76 157.602 247.793 156.972C249.86 156.306 251.595 155.412 252.997 154.291C255.835 151.978 257.254 149.035 257.254 145.46C257.254 138.978 251.753 135.736 240.749 135.736ZM276.702 140.782C276.702 136.928 277.351 133.248 278.647 129.744C279.979 126.205 281.871 123.121 284.324 120.493C289.686 114.816 296.641 111.978 305.192 111.978C313.707 111.978 320.47 114.658 325.481 120.02C330.282 125.136 332.682 131.777 332.682 139.941C332.682 148.106 330.212 154.869 325.271 160.231C320.049 165.907 313.129 168.746 304.508 168.746C295.608 168.746 288.634 165.96 283.588 160.388C278.998 155.307 276.702 148.772 276.702 140.782ZM289.475 140.467C289.475 142.675 289.843 144.812 290.579 146.88C291.315 148.947 292.366 150.717 293.733 152.188C296.641 155.377 300.461 156.972 305.192 156.972C309.572 156.972 313.024 155.412 315.547 152.294C317.999 149.28 319.226 145.355 319.226 140.519C319.226 135.614 317.964 131.654 315.441 128.64C312.743 125.416 309.046 123.804 304.351 123.804C299.585 123.804 295.853 125.522 293.155 128.956C290.702 132.109 289.475 135.947 289.475 140.467ZM339.673 140.782C339.673 136.928 340.321 133.248 341.618 129.744C342.949 126.205 344.842 123.121 347.295 120.493C352.656 114.816 359.612 111.978 368.162 111.978C376.677 111.978 383.44 114.658 388.451 120.02C393.252 125.136 395.653 131.777 395.653 139.941C395.653 148.106 393.182 154.869 388.241 160.231C383.02 165.907 376.099 168.746 367.479 168.746C358.578 168.746 351.605 165.96 346.559 160.388C341.968 155.307 339.673 148.772 339.673 140.782ZM352.446 140.467C352.446 142.675 352.814 144.812 353.55 146.88C354.285 148.947 355.337 150.717 356.703 152.188C359.612 155.377 363.431 156.972 368.162 156.972C372.542 156.972 375.994 155.412 378.517 152.294C380.97 149.28 382.196 145.355 382.196 140.519C382.196 135.614 380.935 131.654 378.412 128.64C375.714 125.416 372.017 123.804 367.321 123.804C362.555 123.804 358.823 125.522 356.125 128.956C353.672 132.109 352.446 135.947 352.446 140.467ZM420.305 161.019C420.305 164.033 420.427 166.345 420.673 167.957H407.427V92.7923H420.305V138.837L444.326 113.029H459.937L439.227 134.843L451.054 150.98C453.612 155.044 455.539 158.023 456.836 159.915L460.305 164.804C461.356 166.17 462.232 167.222 462.933 167.957H454.628C451.545 167.957 448.899 168.22 446.691 168.746L430.292 144.777L420.305 155.395V161.019ZM467.716 97.3653C470.52 92.985 473.446 89.1304 476.495 85.8014L487.796 94.6845C486.289 96.5418 484.887 98.364 483.591 100.151C483.591 100.151 482.241 102.061 479.543 105.88L467.716 97.3653ZM481.541 162.07C481.541 165.084 481.611 167.046 481.751 167.957H468.4V113.029H481.541V162.07ZM510.24 161.229C510.24 164.313 510.38 166.556 510.66 167.957H497.467V113.029H510.24V117.707C514.866 113.888 519.806 111.978 525.063 111.978C530.81 111.978 535.4 113.94 538.834 117.865C542.268 121.754 543.985 126.888 543.985 133.266V154.186C543.985 160.108 544.073 163.665 544.248 164.856C544.423 166.048 544.651 166.819 544.932 167.169C545.247 167.519 545.51 167.835 545.72 168.115L545.615 168.325C542.776 168.08 540.709 167.957 539.412 167.957H535.733C534.612 167.957 533.105 168.01 531.213 168.115V139.468C531.213 129.201 528.094 124.067 521.856 124.067C517.231 124.067 513.359 126.45 510.24 131.216V161.229ZM573.841 153.345C572.545 155.062 571.896 156.429 571.896 157.445C571.896 158.426 572.054 159.197 572.369 159.758C572.685 160.283 573.368 160.791 574.419 161.282C576.732 162.368 580.534 163.332 585.826 164.173C591.117 164.979 595.252 165.995 598.23 167.222C601.244 168.448 603.68 169.955 605.537 171.742C609.006 175.141 610.74 179.959 610.74 186.197C610.74 192.434 608.55 197.217 604.17 200.546C599.79 203.91 593.29 205.593 584.669 205.593C575.979 205.593 568.97 203.7 563.644 199.916C558.318 196.131 555.584 191.103 555.444 184.83C555.234 177.541 558.09 172.268 564.012 169.009C562.4 167.677 561.314 166.118 560.753 164.331C560.227 162.508 559.965 160.441 559.965 158.128C559.965 154.238 561.664 150.944 565.063 148.246C561.103 144.497 559.124 139.836 559.124 134.264C559.124 128.027 561.366 122.806 565.852 118.601C570.582 114.185 576.715 111.978 584.249 111.978C588.208 111.978 591.923 112.714 595.392 114.185C599.948 112.258 603.294 110.576 605.432 109.139C607.569 107.668 608.936 106.599 609.532 105.933L609.847 105.986C610.162 106.827 610.53 108.018 610.951 109.56L611.897 113.344C612.738 116.463 613.246 118.601 613.421 119.757C611.879 121.439 609.164 122.631 605.274 123.331C606.781 126.24 607.534 129.324 607.534 132.582C607.534 135.841 606.973 138.802 605.852 141.466C604.731 144.094 603.136 146.407 601.069 148.404C596.478 152.714 590.626 154.869 583.513 154.869C580.044 154.869 576.82 154.361 573.841 153.345ZM572.475 129.692C571.984 130.953 571.739 132.232 571.739 133.529C571.739 134.825 572.002 136.069 572.527 137.261C573.088 138.452 573.894 139.521 574.945 140.467C577.293 142.569 580.359 143.621 584.144 143.621C587.017 143.621 589.505 142.657 591.608 140.73C593.815 138.627 594.919 136.104 594.919 133.161C594.919 130.182 593.92 127.782 591.923 125.96C589.926 124.137 587.175 123.226 583.671 123.226C577.889 123.226 574.157 125.381 572.475 129.692ZM585.353 194.449C593.973 194.449 598.283 191.436 598.283 185.408C598.283 182.535 596.881 180.222 594.078 178.47C590.924 176.473 585.51 174.913 577.836 173.792L575.103 173.319C572.79 174.545 571.09 176.122 570.004 178.049C568.918 179.977 568.375 181.799 568.375 183.516C568.41 185.268 568.83 186.775 569.636 188.036C570.442 189.298 571.564 190.402 573 191.348C576.189 193.415 580.306 194.449 585.353 194.449Z" fill="white"/>
            </svg>
            <h1>${ language?.invoice?.head }</h1>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <img style="align-self: center;" src=${ qrCodeData } class="gradient-qr" style="height: 80px; width: 80px; padding:5px; margin:3px;" alt="qrCode"/>
                <p> ${ language?.invoice?.date }  : ${ await formatDate( content?.createdAt ) }</p>
                <p>${ language?.invoice?.bookingId } : ${ content?._id }</p>
            </div>
        </div>
        <hr style="height: 2px; background-color:yellow; margin:0;"/>
        <div class="section">
            <h2 style="padding: 20px 0 8px 0;">${ content?.hotelName }</h2>
            <hr style="height: 1px; background-color:teal; margin:0;"/>
        </div>
        <div class="section">
            <h3 style="padding: 20px 0 8px 0; color:teal">${ language?.invoice?.guestInfo }</h3>
            <div style="background-color: #e3e3e3; padding:20px; border-radius:10px;">
                <p style="font-size: 15px; color: #080808">${ language?.invoice?.name }: ${ content?.name }</p>
                <p style="font-size: 15px; color: #080808 ;padding:10px 0 0 0; ">${ language?.invoice?.email }: ${ content?.email }</p>
            </div>
        </div>
        <div class="section">
            <h3 style="padding: 0px 0 8px 0; color:teal">${ language?.invoice?.reservationDetails }</h3>
            
            <!-- reserve table -->
            <div style="background-color: #c9e2e9; padding:20px; border-radius:10px;">
                <table style="border-radius: 8px; width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="font-size: 15px; color: #080808; padding: 5px;">${ language?.invoice?.checkIn }:</td>
                    <td style="font-size: 15px; color: #080808; padding: 5px;">${ await formatDate( content?.checkIn ) }</td>
                </tr>
                <tr>
                    <td style="font-size: 15px; color: #080808; padding: 5px;">${ language?.invoice?.checkOut }:</td>
                    <td style="font-size: 15px; color: #080808; padding: 5px;">${ await formatDate( content?.checkOut ) }</td>
                </tr>
                <tr>
                    <td style="font-size: 15px; color: #080808; padding: 5px;">${ language?.invoice?.nights }:</td>
                    <td style="font-size: 15px; color: #080808; padding: 5px;">${ days }</td>
                </tr>
                <tr>
                    <td style="font-size: 15px; color: #080808; padding: 5px;">${ language?.invoice[ content?.rentType ] }:</td>
                    <td style="font-size: 15px; color: #080808; padding: 5px;">${ content?.rentCount }</td>
                </tr>
            </table>
            </div>

        </div>
        <div class="section">
            <h3 style="padding: 0px 0 8px 0; color:teal">${ language?.invoice?.billingAddress }</h3>
            <div style="background-color: #e3e3e3; padding:20px; border-radius:10px; display:flex; gap: 20px; flex-direction:column;">
                <div style="display: flex; gap:30px;">
                    <p >${ language?.invoice?.street }: ${ content?.paymentDetails?.streetAddress }</p>
                    <p >${ language?.invoice?.city }: ${ content?.paymentDetails?.city }</p>
                </div>
                <div style="display: flex; gap:30px;">
                    <p >${ language?.invoice?.state }: ${ content?.paymentDetails?.state }</p>
                    <p >${ language?.invoice?.zip }: ${ content?.paymentDetails?.zipCode }</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h3 style="padding: 0px 0 8px 0; color:teal">${ language?.invoice?.paySummery }</h3>
            <!-- bill -->
            <table style="background-color: teal; padding: 20px; border-radius: 10px; width: 100%; border-collapse: separate; border-spacing: 10px;">
    <tr>
        <td style="font-size: 15px; color: #ffffff; padding: 10px;">${ content?.rentCount } x ${ content?.rentType } x ( ${ days } ${ language?.invoice?.nights } × ${ content?.rate } ৳):</td>
        <td style="font-size: 15px; color: #ffffff; padding: 10px;">${ calculatePrice } ৳</td>
    </tr>
    <tr>
        <td style="font-size: 15px; color: #ffffff; padding: 10px;">${ language?.invoice?.cFee }</td>
        <td style="font-size: 15px; color: #ffffff; padding: 10px;">17.50 ৳</td>
    </tr>
    <tr>
        <td style="font-size: 15px; color: #ffffff; padding: 10px;">${ language?.invoice?.sFee }</td>
        <td style="font-size: 15px; color: #ffffff; padding: 10px;">51.31 ৳</td>
    </tr>
    <tr>
        <td style="font-size: 18px; color: #ffffff; font-weight: bold; padding: 10px;">${ language?.invoice?.total }:</td>
        <td style="font-size: 18px; color: #ffffff; font-weight: bold; padding: 10px;">${ total } ৳</td>
    </tr>
            </table>

        </div>
        <div style="padding:5px;" class="contact">
            <p>${ content?.hotelName }</p>
            <p>${ content?.hotelAddress }</p>
            <p>${ language?.invoice?.tel }: *1 234 567 8900 | ${ language?.invoice?.email }: contact@hotel_${ content?.hotelName.slice( 0, 3 ) }.com</p>
        </div>
        <footer style="padding: 10px;">
    <p style="text-align: center; font-family: monospace; font-size: 12px; color: #333;">
        © ${ language?.invoice?.coppyRight } <a href="https://github.com/muhamash" style="color: teal; text-decoration: none;">github.com/muhamash</a>
    </p>
        </footer>
    </div>
</body>
            </html>`;
}

export async function generateVerificationToken() : Promise<number> {
    return crypto.randomBytes(32).toString('hex');
}

export function debounce<T extends (...args: never[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}