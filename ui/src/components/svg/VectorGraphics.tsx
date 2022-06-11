import Background1 from "./backgrounds/Background1"
import Background2 from "./backgrounds/Background2"
import Background3 from "./backgrounds/Background3"
import Background4 from "./backgrounds/Background4"
import Background5 from "./backgrounds/Background5"
import Background6 from "./backgrounds/Background6"

export const BoardSvg = () => {
    return (
        <svg style={{ marginRight: "16px" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_124_44885)">
                <path d="M3 1.502C2.60218 1.502 2.22065 1.66003 1.93934 1.94134C1.65804 2.22264 1.5 2.60417 1.5 3.002C1.5 3.39982 1.65804 3.78135 1.93934 4.06266C2.22065 4.34396 2.60218 4.502 3 4.502C3.39783 4.502 3.77936 4.34396 4.06066 4.06266C4.34197 3.78135 4.5 3.39982 4.5 3.002C4.5 2.60417 4.34197 2.22264 4.06066 1.94134C3.77936 1.66003 3.39783 1.502 3 1.502ZM1.46676e-06 3.002C-0.000720717 2.2713 0.265264 1.56545 0.748032 1.01695C1.2308 0.468447 1.89716 0.114995 2.62204 0.0229356C3.34691 -0.069124 4.08047 0.106539 4.68502 0.516953C5.28957 0.927366 5.72355 1.54431 5.9055 2.252H18.0945C18.2269 1.74 18.4923 1.27209 18.8638 0.895695C19.2352 0.519298 19.6996 0.247788 20.2098 0.108677C20.72 -0.0304339 21.258 -0.032202 21.7691 0.103552C22.2802 0.239306 22.7463 0.507758 23.1203 0.881704C23.4942 1.25565 23.7627 1.7218 23.8984 2.23292C24.0342 2.74404 24.0324 3.28196 23.8933 3.79217C23.7542 4.30239 23.4827 4.76676 23.1063 5.13824C22.7299 5.50972 22.262 5.7751 21.75 5.9075V18.0965C22.262 18.2289 22.7299 18.4943 23.1063 18.8657C23.4827 19.2372 23.7542 19.7016 23.8933 20.2118C24.0324 20.722 24.0342 21.26 23.8984 21.7711C23.7627 22.2822 23.4942 22.7483 23.1203 23.1223C22.7463 23.4962 22.2802 23.7647 21.7691 23.9004C21.258 24.0362 20.72 24.0344 20.2098 23.8953C19.6996 23.7562 19.2352 23.4847 18.8638 23.1083C18.4923 22.7319 18.2269 22.264 18.0945 21.752H5.9055C5.77311 22.264 5.50773 22.7319 5.13625 23.1083C4.76477 23.4847 4.30039 23.7562 3.79018 23.8953C3.27996 24.0344 2.74204 24.0362 2.23092 23.9004C1.71981 23.7647 1.25366 23.4962 0.879709 23.1223C0.505763 22.7483 0.237312 22.2822 0.101558 21.7711C-0.0341964 21.26 -0.0324283 20.722 0.106683 20.2118C0.245794 19.7016 0.517304 19.2372 0.8937 18.8657C1.2701 18.4943 1.738 18.2289 2.25 18.0965V5.9075C1.60591 5.74119 1.03535 5.36553 0.62806 4.83957C0.220765 4.31362 -0.000167602 3.66721 1.46676e-06 3.002ZM3.75 5.9075V18.0965C4.8045 18.3665 5.634 19.1975 5.9055 20.252H18.0945C18.229 19.7332 18.4998 19.2597 18.8788 18.8808C19.2577 18.5018 19.7312 18.231 20.25 18.0965V5.9075C19.7312 5.773 19.2577 5.50223 18.8788 5.12324C18.4998 4.74425 18.229 4.27082 18.0945 3.752H5.9055C5.77101 4.27082 5.50024 4.74425 5.12125 5.12324C4.74226 5.50223 4.26883 5.773 3.75 5.9075ZM21 1.502C20.6022 1.502 20.2206 1.66003 19.9393 1.94134C19.658 2.22264 19.5 2.60417 19.5 3.002C19.5 3.39982 19.658 3.78135 19.9393 4.06266C20.2206 4.34396 20.6022 4.502 21 4.502C21.3978 4.502 21.7794 4.34396 22.0607 4.06266C22.342 3.78135 22.5 3.39982 22.5 3.002C22.5 2.60417 22.342 2.22264 22.0607 1.94134C21.7794 1.66003 21.3978 1.502 21 1.502ZM3 19.502C2.60218 19.502 2.22065 19.66 1.93934 19.9413C1.65804 20.2226 1.5 20.6042 1.5 21.002C1.5 21.3998 1.65804 21.7814 1.93934 22.0627C2.22065 22.344 2.60218 22.502 3 22.502C3.39783 22.502 3.77936 22.344 4.06066 22.0627C4.34197 21.7814 4.5 21.3998 4.5 21.002C4.5 20.6042 4.34197 20.2226 4.06066 19.9413C3.77936 19.66 3.39783 19.502 3 19.502ZM21 19.502C20.6022 19.502 20.2206 19.66 19.9393 19.9413C19.658 20.2226 19.5 20.6042 19.5 21.002C19.5 21.3998 19.658 21.7814 19.9393 22.0627C20.2206 22.344 20.6022 22.502 21 22.502C21.3978 22.502 21.7794 22.344 22.0607 22.0627C22.342 21.7814 22.5 21.3998 22.5 21.002C22.5 20.6042 22.342 20.2226 22.0607 19.9413C21.7794 19.66 21.3978 19.502 21 19.502Z" fill="#7C8DB0" />
            </g>
            <defs>
                <clipPath id="clip0_124_44885">
                    <rect width="23.999" height="24.0019" fill="white" transform="translate(0 -0.000976562)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export const DifficultySvg = () => {
    return (
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.30871 11.3628V0.629835H2.54763L-0.000976562 2.48542V4.19099L2.45913 2.42091H2.54913V11.3628H4.31021H4.30871ZM9.12842 3.72747V3.63297C9.12842 2.70592 9.78845 1.87939 10.9225 1.87939C11.9365 1.87939 12.6836 2.53942 12.6836 3.53846C12.6836 4.4745 12.0535 5.19003 11.473 5.82756L7.48435 10.2468V11.3628H14.6547V9.87774H9.96395V9.77423L12.6146 6.7951C13.5896 5.70905 14.4702 4.79702 14.4702 3.38995C14.4687 1.69038 13.0841 0.416826 10.9615 0.416826C8.6019 0.416826 7.42134 2.0129 7.42134 3.64197V3.72747H9.12842ZM18.9673 6.55209H20.1464C21.3809 6.55209 22.2075 7.27362 22.215 8.32067C22.23 9.38121 21.3899 10.1447 20.0834 10.1357C18.9283 10.1282 18.0943 9.50722 18.0148 8.70618H16.3722C16.4352 10.2858 17.7793 11.5833 20.0684 11.5833C22.2855 11.5833 24.0316 10.3248 23.9986 8.36717C23.9686 6.6526 22.6155 5.89056 21.672 5.79606V5.70155C22.4745 5.56655 23.6926 4.71151 23.661 3.18445C23.622 1.60488 22.2615 0.401825 20.1224 0.416826C17.8723 0.424326 16.6467 1.73688 16.6002 3.26395H18.2743C18.3223 2.51692 19.0213 1.84789 20.0834 1.84789C21.1379 1.84789 21.8925 2.50042 21.8925 3.45296C21.9 4.413 21.1364 5.11203 20.0924 5.11203H18.9673V6.55209Z" fill="#7C8DB0" />
        </svg>
    )
}

export const PersonSvg = () => {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15.999" cy="11" r="4" fill="#6E7491" />
            <path d="M9.99902 24C8.89445 24 7.97337 23.0907 8.24588 22.0202C9.12691 18.5595 12.2641 16 15.999 16C19.734 16 22.8711 18.5595 23.7522 22.0202C24.0247 23.0907 23.1036 24 21.999 24H9.99902Z" fill="#6E7491" />
        </svg>
    )
}

export const HouseSvg = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.49981 16.875V8.74999H3.74981V16.875C3.74981 17.0407 3.81566 17.1997 3.93287 17.3169C4.05008 17.4341 4.20905 17.5 4.37481 17.5H15.6248C15.7906 17.5 15.9495 17.4341 16.0668 17.3169C16.184 17.1997 16.2498 17.0407 16.2498 16.875V8.74999H17.4998V16.875C17.4998 17.3723 17.3023 17.8492 16.9506 18.2008C16.599 18.5524 16.1221 18.75 15.6248 18.75H4.37481C3.87753 18.75 3.40062 18.5524 3.04899 18.2008C2.69736 17.8492 2.49981 17.3723 2.49981 16.875ZM16.2498 3.12499V7.49999L13.7498 4.99999V3.12499C13.7498 2.95923 13.8157 2.80025 13.9329 2.68304C14.0501 2.56583 14.2091 2.49999 14.3748 2.49999H15.6248C15.7906 2.49999 15.9495 2.56583 16.0668 2.68304C16.184 2.80025 16.2498 2.95923 16.2498 3.12499Z" fill="#7C8DB0" />
            <path fillRule="evenodd" clipRule="evenodd" d="M9.11606 1.87499C9.35047 1.64065 9.66836 1.509 9.99981 1.509C10.3313 1.509 10.6492 1.64065 10.8836 1.87499L19.1923 10.1825C19.3097 10.2998 19.3756 10.459 19.3756 10.625C19.3756 10.791 19.3097 10.9501 19.1923 11.0675C19.075 11.1848 18.9158 11.2508 18.7498 11.2508C18.5838 11.2508 18.4247 11.1848 18.3073 11.0675L9.99981 2.75874L1.69231 11.0675C1.57495 11.1848 1.41578 11.2508 1.24981 11.2508C1.08384 11.2508 0.924671 11.1848 0.807313 11.0675C0.689955 10.9501 0.624023 10.791 0.624023 10.625C0.624023 10.459 0.689955 10.2998 0.807313 10.1825L9.11606 1.87499Z" fill="#7C8DB0" />
        </svg>
    )
}

export const HotelSvg = () => {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M8 26V7.00001L18 7V12H15C14.4477 12 14 12.4477 14 13V26H8ZM16.0048 28L16 28H7.5C6.67157 28 6 27.3284 6 26.5V6.50001C6 5.67158 6.67157 5.00001 7.5 5.00001L18.5 5C19.3284 5 20 5.67157 20 6.5V12H25C25.5523 12 26 12.4477 26 13V27C26 27.5523 25.5523 28 25 28H21.2857H18.7143H16.0048ZM16 26V14H24V26H22V23C22 22.4477 21.5523 22 21 22H19C18.4477 22 18 22.4477 18 23V26H16ZM10 9.5C10 9.22386 10.2239 9 10.5 9H11.5C11.7761 9 12 9.22386 12 9.5V10.5C12 10.7761 11.7761 11 11.5 11H10.5C10.2239 11 10 10.7761 10 10.5V9.5ZM10.5 13C10.2239 13 10 13.2239 10 13.5V14.5C10 14.7761 10.2239 15 10.5 15H11.5C11.7761 15 12 14.7761 12 14.5V13.5C12 13.2239 11.7761 13 11.5 13H10.5ZM10 17.5C10 17.2239 10.2239 17 10.5 17H11.5C11.7761 17 12 17.2239 12 17.5V18.5C12 18.7761 11.7761 19 11.5 19H10.5C10.2239 19 10 18.7761 10 18.5V17.5ZM10.5 21C10.2239 21 10 21.2239 10 21.5V22.5C10 22.7761 10.2239 23 10.5 23H11.5C11.7761 23 12 22.7761 12 22.5V21.5C12 21.2239 11.7761 21 11.5 21H10.5ZM14 9.5C14 9.22386 14.2239 9 14.5 9H15.5C15.7761 9 16 9.22386 16 9.5V10.5C16 10.7761 15.7761 11 15.5 11H14.5C14.2239 11 14 10.7761 14 10.5V9.5Z" fill="#6E7491" />
        </svg>
    )
}

export const BackgroundSvg = () => {

    const random = Math.floor(Math.random() * 6);
    return (
        <>
            <svg width="80%" height="80%" viewBox="0 20 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H100V100H0V0Z" />
                {
                    random === 0 ? <Background1 /> :
                        random === 1 ? <Background2 /> :
                            random === 2 ? <Background3 /> :
                                random === 3 ? <Background4 /> :
                                    random === 4 ? <Background5 /> :
                                        random === 5 ? <Background6 /> :
                                            null
                }
            </svg>
        </>
    )

}


export const PageNotFound = () => {
    return (
        <>
        <svg width="80%" height="80%" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860.13137 571.14799"><path d="M605.66974,324.95306c-7.66934-12.68446-16.7572-26.22768-30.98954-30.36953-16.482-4.7965-33.4132,4.73193-47.77473,14.13453a1392.15692,1392.15692,0,0,0-123.89338,91.28311l.04331.49238q46.22556-3.1878,92.451-6.37554c22.26532-1.53546,45.29557-3.2827,64.97195-13.8156,7.46652-3.99683,14.74475-9.33579,23.20555-9.70782,10.51175-.46217,19.67733,6.87923,26.8802,14.54931,42.60731,45.371,54.937,114.75409,102.73817,154.61591A1516.99453,1516.99453,0,0,0,605.66974,324.95306Z" transform="translate(-169.93432 -164.42601)" fill="#f2f2f2" /><path d="M867.57068,709.78146c-4.71167-5.94958-6.6369-7.343-11.28457-13.34761q-56.7644-73.41638-106.70791-151.79237-33.92354-53.23-64.48275-108.50439-14.54864-26.2781-28.29961-52.96872-10.67044-20.6952-20.8646-41.63793c-1.94358-3.98782-3.8321-7.99393-5.71122-12.00922-4.42788-9.44232-8.77341-18.93047-13.43943-28.24449-5.31686-10.61572-11.789-21.74485-21.55259-28.877a29.40493,29.40493,0,0,0-15.31855-5.89458c-7.948-.51336-15.28184,2.76855-22.17568,6.35295-50.43859,26.301-97.65922,59.27589-140.3696,96.79771A730.77816,730.77816,0,0,0,303.32241,496.24719c-1.008,1.43927-3.39164.06417-2.37419-1.38422q6.00933-8.49818,12.25681-16.81288A734.817,734.817,0,0,1,500.80465,303.06436q18.24824-11.82581,37.18269-22.54245c6.36206-3.60275,12.75188-7.15967,19.25136-10.49653,6.37146-3.27274,13.13683-6.21547,20.41563-6.32547,24.7701-.385,37.59539,27.66695,46.40506,46.54248q4.15283,8.9106,8.40636,17.76626,16.0748,33.62106,33.38729,66.628,10.68453,20.379,21.83683,40.51955,34.7071,62.71816,73.77854,122.897c34.5059,53.1429,68.73651,100.08874,108.04585,149.78472C870.59617,709.21309,868.662,711.17491,867.57068,709.78146Z" transform="translate(-169.93432 -164.42601)" fill="#e4e4e4" /><path d="M414.91613,355.804c-1.43911-1.60428-2.86927-3.20856-4.31777-4.81284-11.42244-12.63259-23.6788-25.11847-39.3644-32.36067a57.11025,57.11025,0,0,0-23.92679-5.54622c-8.56213.02753-16.93178,2.27348-24.84306,5.41792-3.74034,1.49427-7.39831,3.1902-11.00078,4.99614-4.11634,2.07182-8.15927,4.28118-12.1834,6.50883q-11.33112,6.27044-22.36816,13.09089-21.9606,13.57221-42.54566,29.21623-10.67111,8.11311-20.90174,16.75788-9.51557,8.03054-18.64618,16.492c-1.30169,1.20091-3.24527-.74255-1.94358-1.94347,1.60428-1.49428,3.22691-2.97938,4.84955-4.44613q6.87547-6.21546,13.9712-12.19257,12.93921-10.91827,26.54851-20.99312,21.16293-15.67614,43.78288-29.22541,11.30361-6.76545,22.91829-12.96259c2.33794-1.24675,4.70318-2.466,7.09572-3.6211a113.11578,113.11578,0,0,1,16.86777-6.86632,60.0063,60.0063,0,0,1,25.476-2.50265,66.32706,66.32706,0,0,1,23.50512,8.1314c15.40091,8.60812,27.34573,21.919,38.97,34.90915C418.03337,355.17141,416.09875,357.12405,414.91613,355.804Z" transform="translate(-169.93432 -164.42601)" fill="#e4e4e4" /><path d="M730.47659,486.71092l36.90462-13.498,18.32327-6.70183c5.96758-2.18267,11.92082-4.66747,18.08988-6.23036a28.53871,28.53871,0,0,1,16.37356.20862,37.73753,37.73753,0,0,1,12.771,7.91666,103.63965,103.63965,0,0,1,10.47487,11.18643c3.98932,4.79426,7.91971,9.63877,11.86772,14.46706q24.44136,29.89094,48.56307,60.04134,24.12117,30.14991,47.91981,60.556,23.85681,30.48041,47.38548,61.21573,2.88229,3.76518,5.75966,7.53415c1.0598,1.38809,3.44949.01962,2.37472-1.38808Q983.582,650.9742,959.54931,620.184q-24.09177-30.86383-48.51647-61.46586-24.42421-30.60141-49.17853-60.93743-6.16706-7.55761-12.35445-15.09858c-3.47953-4.24073-6.91983-8.52718-10.73628-12.47427-7.00539-7.24516-15.75772-13.64794-26.23437-13.82166-6.15972-.10214-12.121,1.85248-17.844,3.92287-6.16968,2.232-12.32455,4.50571-18.48633,6.75941l-37.16269,13.59243-9.29067,3.3981c-1.64875.603-.93651,3.2619.73111,2.652Z" transform="translate(-169.93432 -164.42601)" fill="#e4e4e4" /><path d="M366.37741,334.52609c-18.75411-9.63866-42.77137-7.75087-60.00508,4.29119a855.84708,855.84708,0,0,1,97.37056,22.72581C390.4603,353.75916,380.07013,341.5635,366.37741,334.52609Z" transform="translate(-169.93432 -164.42601)" fill="#f2f2f2" /><path d="M306.18775,338.7841l-3.61042,2.93462c1.22123-1.02713,2.4908-1.99013,3.795-2.90144C306.31073,338.80665,306.24935,338.79473,306.18775,338.7841Z" transform="translate(-169.93432 -164.42601)" fill="#f2f2f2" /><path d="M831.54929,486.84576c-3.6328-4.42207-7.56046-9.05222-12.99421-10.84836l-5.07308.20008A575.436,575.436,0,0,0,966.74929,651.418Q899.14929,569.13192,831.54929,486.84576Z" transform="translate(-169.93432 -164.42601)" fill="#f2f2f2" /><path d="M516.08388,450.36652A37.4811,37.4811,0,0,0,531.015,471.32518c2.82017,1.92011,6.15681,3.76209,7.12158,7.03463a8.37858,8.37858,0,0,1-.87362,6.1499,24.88351,24.88351,0,0,1-3.86126,5.04137l-.13667.512c-6.99843-4.14731-13.65641-9.3934-17.52227-16.55115s-4.40553-16.53895.34116-23.14544" transform="translate(-169.93432 -164.42601)" fill="#f2f2f2" /><path d="M749.08388,653.36652A37.4811,37.4811,0,0,0,764.015,674.32518c2.82017,1.92011,6.15681,3.76209,7.12158,7.03463a8.37858,8.37858,0,0,1-.87362,6.1499,24.88351,24.88351,0,0,1-3.86126,5.04137l-.13667.512c-6.99843-4.14731-13.65641-9.3934-17.52227-16.55115s-4.40553-16.53895.34116-23.14544" transform="translate(-169.93432 -164.42601)" fill="#f2f2f2" /><path d="M284.08388,639.36652A37.4811,37.4811,0,0,0,299.015,660.32518c2.82017,1.92011,6.15681,3.76209,7.12158,7.03463a8.37858,8.37858,0,0,1-.87362,6.1499,24.88351,24.88351,0,0,1-3.86126,5.04137l-.13667.512c-6.99843-4.14731-13.65641-9.3934-17.52227-16.55115s-4.40553-16.53895.34116-23.14544" transform="translate(-169.93432 -164.42601)" fill="#f2f2f2" /><circle cx="649.24878" cy="51" r="51" fill="#6c63ff" /><path d="M911.21851,176.29639c-24.7168-3.34094-52.93512,10.01868-59.34131,34.12353a21.59653,21.59653,0,0,0-41.09351,2.10871l2.82972,2.02667a372.27461,372.27461,0,0,0,160.65881-.72638C957.07935,195.76,935.93537,179.63727,911.21851,176.29639Z" transform="translate(-169.93432 -164.42601)" fill="#f0f0f0" /><path d="M805.21851,244.29639c-24.7168-3.34094-52.93512,10.01868-59.34131,34.12353a21.59653,21.59653,0,0,0-41.09351,2.10871l2.82972,2.02667a372.27461,372.27461,0,0,0,160.65881-.72638C851.07935,263.76,829.93537,247.63727,805.21851,244.29639Z" transform="translate(-169.93432 -164.42601)" fill="#f0f0f0" /><path d="M1020.94552,257.15423a.98189.98189,0,0,1-.30176-.04688C756.237,173.48919,523.19942,184.42376,374.26388,208.32122c-20.26856,3.251-40.59131,7.00586-60.40381,11.16113-5.05811,1.05957-10.30567,2.19532-15.59668,3.37793-6.31885,1.40723-12.55371,2.85645-18.53223,4.30567q-3.873.917-7.59472,1.84863c-3.75831.92773-7.57178,1.89453-11.65967,2.957-4.56787,1.17774-9.209,2.41309-13.79737,3.67188a.44239.44239,0,0,1-.05127.01465l.00049.001c-5.18261,1.415-10.33789,2.8711-15.32324,4.3252-2.69824.77929-5.30371,1.54785-7.79932,2.30664-.2788.07715-.52587.15136-.77636.22754l-.53614.16308c-.31054.09473-.61718.1875-.92382.27539l-.01953.00586.00048.001-.81152.252c-.96777.293-1.91211.5791-2.84082.86426-24.54492,7.56641-38.03809,12.94922-38.17139,13.00195a1,1,0,1,1-.74414-1.85644c.13428-.05274,13.69336-5.46289,38.32764-13.05762.93213-.28613,1.87891-.57226,2.84961-.86621l.7539-.23438c.02588-.00976.05176-.01757.07813-.02539.30518-.08691.60986-.17968.91943-.27343l.53711-.16309c.26758-.08105.53125-.16113.80127-.23535,2.47852-.75391,5.09278-1.52441,7.79785-2.30664,4.98731-1.45508,10.14746-2.91113,15.334-4.32813.01611-.00586.03271-.00976.04883-.01464v-.001c4.60449-1.2627,9.26269-2.50293,13.84521-3.68457,4.09424-1.06348,7.915-2.03223,11.67969-2.96192q3.73755-.93017,7.60937-1.85253c5.98536-1.45118,12.23291-2.90235,18.563-4.3125,5.29932-1.1836,10.55567-2.32227,15.62207-3.38282,19.84326-4.16211,40.19776-7.92285,60.49707-11.17871C523.09591,182.415,756.46749,171.46282,1021.2463,255.2011a.99974.99974,0,0,1-.30078,1.95313Z" transform="translate(-169.93432 -164.42601)" fill="#ccc" /><path d="M432.92309,584.266a6.72948,6.72948,0,0,0-1.7-2.67,6.42983,6.42983,0,0,0-.92-.71c-2.61-1.74-6.51-2.13-8.99,0a5.81012,5.81012,0,0,0-.69.71q-1.11,1.365-2.28,2.67c-1.28,1.46-2.59,2.87-3.96,4.24-.39.38-.78.77-1.18,1.15-.23.23-.46.45-.69.67-.88.84-1.78,1.65-2.69,2.45-.48.43-.96.85-1.45,1.26-.73.61-1.46,1.22-2.2,1.81-.07.05-.14.1-.21.16-.02.01-.03.03-.05.04-.01,0-.02,0-.03.02a.17861.17861,0,0,0-.07.05c-.22.15-.37.25-.48.34.04-.01995.08-.05.12-.07-.18.14-.37.28-.55.42-1.75,1.29-3.54,2.53-5.37,3.69a99.21022,99.21022,0,0,1-14.22,7.55c-.33.13-.67.27-1.01.4a85.96993,85.96993,0,0,1-40.85,6.02q-2.13008-.165-4.26-.45c-1.64-.24-3.27-.53-4.89-.86a97.93186,97.93186,0,0,1-18.02-5.44,118.65185,118.65185,0,0,1-20.66-12.12c-1-.71-2.01-1.42-3.02-2.11,1.15-2.82,2.28-5.64,3.38-8.48.55-1.37,1.08-2.74,1.6-4.12,4.09-10.63,7.93-21.36,11.61-32.13q5.58-16.365,10.53-32.92.51-1.68.99-3.36,2.595-8.745,4.98-17.53c.15-.56994.31-1.12994.45-1.7q.68994-2.52,1.35-5.04c1-3.79-1.26-8.32-5.24-9.23a7.63441,7.63441,0,0,0-9.22,5.24c-.43,1.62-.86,3.23-1.3,4.85q-3.165,11.74494-6.66,23.41-.51,1.68-1.02,3.36-7.71,25.41-16.93,50.31-1.11,3.015-2.25,6.01c-.37.98-.74,1.96-1.12,2.94-.73,1.93-1.48,3.86-2.23,5.79-.43006,1.13-.87006,2.26-1.31,3.38-.29.71-.57,1.42-.85,2.12a41.80941,41.80941,0,0,0-8.81-2.12l-.48-.06a27.397,27.397,0,0,0-7.01.06,23.91419,23.91419,0,0,0-17.24,10.66c-4.77,7.51-4.71,18.25,1.98,24.63,6.89,6.57,17.32,6.52,25.43,2.41a28.35124,28.35124,0,0,0,10.52-9.86,50.56939,50.56939,0,0,0,2.74-4.65c.21.14.42.28.63.43.8.56,1.6,1.13,2.39,1.69a111.73777,111.73777,0,0,0,14.51,8.91,108.35887,108.35887,0,0,0,34.62,10.47c.27.03.53.07.8.1,1.33.17,2.67.3,4.01.41a103.78229,103.78229,0,0,0,55.58-11.36q2.175-1.125,4.31-2.36,3.315-1.92,6.48-4.08c1.15-.78,2.27-1.57,3.38-2.4a101.04244,101.04244,0,0,0,13.51-11.95q2.35491-2.475,4.51-5.11005a8.0612,8.0612,0,0,0,2.2-5.3A7.5644,7.5644,0,0,0,432.92309,584.266Zm-165.59,23.82c.21-.15.42-.31.62-.47C267.89312,607.766,267.60308,607.936,267.33312,608.086Zm3.21-3.23c-.23.26-.44.52-.67.78a23.36609,23.36609,0,0,1-2.25,2.2c-.11.1-.23.2-.35.29a.00976.00976,0,0,0-.01.01,3.80417,3.80417,0,0,0-.42005.22q-.645.39-1.31994.72a17.00459,17.00459,0,0,1-2.71.75,16.79925,16.79925,0,0,1-2.13.02h-.02a14.82252,14.82252,0,0,1-1.45-.4c-.24-.12-.47-.25994-.7-.4-.09-.08-.17005-.16-.22-.21a2.44015,2.44015,0,0,1-.26995-.29.0098.0098,0,0,0-.01-.01c-.11005-.2-.23005-.4-.34-.6a.031.031,0,0,1-.01-.02c-.08-.25-.15-.51-.21-.77a12.51066,12.51066,0,0,1,.01-1.37,13.4675,13.4675,0,0,1,.54-1.88,11.06776,11.06776,0,0,1,.69-1.26c.02-.04.12-.2.23-.38.01-.01.01-.01.01-.02.15-.17.3-.35.46-.51.27-.3.56-.56.85-.83a18.02212,18.02212,0,0,1,1.75-1.01,19.48061,19.48061,0,0,1,2.93-.79,24.98945,24.98945,0,0,1,4.41.04,30.30134,30.30134,0,0,1,4.1,1.01,36.94452,36.94452,0,0,1-2.77,4.54C270.6231,604.746,270.58312,604.806,270.54308,604.856Zm-11.12-3.29a2.18029,2.18029,0,0,1-.31.38995A1.40868,1.40868,0,0,1,259.42309,601.566Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><path d="M402.86309,482.136q-.13494,4.71-.27,9.42-.285,10.455-.59,20.92-.315,11.775-.66,23.54-.165,6.07507-.34,12.15-.465,16.365-.92,32.72c-.03,1.13-.07,2.25-.1,3.38q-.225,8.11506-.45,16.23-.255,8.805-.5,17.61-.18,6.59994-.37,13.21-1.34994,47.895-2.7,95.79a7.64844,7.64844,0,0,1-7.5,7.5,7.56114,7.56114,0,0,1-7.5-7.5q.75-26.94,1.52-53.88.675-24.36,1.37-48.72.225-8.025.45-16.06.345-12.09.68-24.18c.03-1.13.07-2.25.1-3.38.02-.99.05-1.97.08-2.96q.66-23.475,1.32-46.96.27-9.24.52-18.49.3-10.545.6-21.08c.09-3.09.17005-6.17.26-9.26a7.64844,7.64844,0,0,1,7.5-7.5A7.56116,7.56116,0,0,1,402.86309,482.136Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><path d="M814.29118,484.2172a893.23753,893.23753,0,0,1-28.16112,87.94127c-3.007,7.94641-6.08319,15.877-9.3715,23.71185l.75606-1.7916a54.58274,54.58274,0,0,1-5.58953,10.61184q-.22935.32119-.46685.63642,1.16559-1.49043.4428-.589c-.25405.30065-.5049.60219-.7676.89546a23.66436,23.66436,0,0,1-2.2489,2.20318q-.30139.25767-.61188.5043l.93783-.729c-.10884.25668-.87275.59747-1.11067.74287a18.25362,18.25362,0,0,1-2.40479,1.21853l1.7916-.75606a19.0859,19.0859,0,0,1-4.23122,1.16069l1.9938-.26791a17.02055,17.02055,0,0,1-4.29785.046l1.99379.2679a14.0022,14.0022,0,0,1-3.40493-.917l1.79159.75606a12.01175,12.01175,0,0,1-1.67882-.89614c-.27135-.17688-1.10526-.80852-.01487.02461,1.13336.86595.14562.07434-.08763-.15584-.19427-.19171-.36962-.4-.55974-.595-.88208-.90454.99637,1.55662.39689.49858a18.18179,18.18179,0,0,1-.87827-1.63672l.75606,1.7916a11.92493,11.92493,0,0,1-.728-2.65143l.26791,1.9938a13.65147,13.65147,0,0,1-.00316-3.40491l-.2679,1.9938a15.96371,15.96371,0,0,1,.99486-3.68011l-.75606,1.7916a16.72914,16.72914,0,0,1,1.17794-2.29848,6.72934,6.72934,0,0,1,.72851-1.0714c.04915.01594-1.26865,1.51278-.56937.757.1829-.19767.354-.40592.539-.602.29617-.31382.61354-.60082.92561-.89791,1.04458-.99442-1.46188.966-.25652.17907a19.0489,19.0489,0,0,1,2.74925-1.49923l-1.79159.75606a20.31136,20.31136,0,0,1,4.99523-1.33984l-1.9938.2679a25.62828,25.62828,0,0,1,6.46062.07647l-1.9938-.2679a33.21056,33.21056,0,0,1,7.89178,2.2199l-1.7916-.75606c5.38965,2.31383,10.16308,5.74926,14.928,9.118a111.94962,111.94962,0,0,0,14.50615,8.9065,108.38849,108.38849,0,0,0,34.62226,10.47371,103.93268,103.93268,0,0,0,92.58557-36.75192,8.07773,8.07773,0,0,0,2.1967-5.3033,7.63232,7.63232,0,0,0-2.1967-5.3033c-2.75154-2.52586-7.94926-3.239-10.6066,0a95.63575,95.63575,0,0,1-8.10664,8.72692q-2.01736,1.914-4.14232,3.70983-1.21364,1.02588-2.46086,2.01121c-.3934.31081-1.61863,1.13807.26309-.19744-.43135.30614-.845.64036-1.27058.95478a99.26881,99.26881,0,0,1-20.33215,11.56478l1.79159-.75606a96.8364,96.8364,0,0,1-24.17119,6.62249l1.99379-.2679a97.64308,97.64308,0,0,1-25.75362-.03807l1.99379.2679a99.79982,99.79982,0,0,1-24.857-6.77027l1.7916.75607a116.02515,116.02515,0,0,1-21.7364-12.59112,86.87725,86.87725,0,0,0-11.113-6.99417,42.8238,42.8238,0,0,0-14.43784-4.38851c-9.43884-1.11076-19.0571,2.56562-24.24624,10.72035-4.77557,7.50482-4.71394,18.24362,1.97369,24.62519,6.8877,6.5725,17.31846,6.51693,25.43556,2.40567,7.81741-3.95946,12.51288-12.18539,15.815-19.94186,7.43109-17.45514,14.01023-35.31364,20.1399-53.263q9.09651-26.63712,16.49855-53.81332.91661-3.36581,1.80683-6.73869c1.001-3.78869-1.26094-8.32-5.23829-9.22589a7.63317,7.63317,0,0,0-9.22589,5.23829Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><path d="M889.12382,482.13557l-2.69954,95.79311-2.68548,95.29418-1.5185,53.88362a7.56465,7.56465,0,0,0,7.5,7.5,7.64923,7.64923,0,0,0,7.5-7.5l2.69955-95.79311,2.68548-95.29418,1.51849-53.88362a7.56465,7.56465,0,0,0-7.5-7.5,7.64923,7.64923,0,0,0-7.5,7.5Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><path d="M629.52566,700.36106h2.32885V594.31942h54.32863v-2.32291H631.85451V547.25214H673.8102q-.92256-1.17339-1.89893-2.31694H631.85451V515.38231c-.7703-.32846-1.54659-.64493-2.32885-.9435V544.9352h-45.652V507.07c-.78227.03583-1.55258.08959-2.3289.15527v37.71h-36.4201V516.68409c-.78227.34636-1.55258.71061-2.31694,1.0928V544.9352h-30.6158v2.31694h30.6158v44.74437h-30.6158v2.32291h30.6158V700.36106h2.31694V594.31942a36.41283,36.41283,0,0,1,36.4201,36.42007v69.62157h2.3289V594.31942h45.652Zm-84.401-108.36455V547.25214h36.4201v44.74437Zm38.749,0V547.25214h.91362a44.74135,44.74135,0,0,1,44.73842,44.74437Z" transform="translate(-169.93432 -164.42601)" opacity="0.2" /><path d="M615.30309,668.566a63.05854,63.05854,0,0,1-20.05,33.7c-.74.64-1.48,1.26-2.25,1.87q-2.805.25506-5.57.52c-1.53.14-3.04.29-4.54.43l-.27.03-.19-1.64-.76-6.64a37.623,37.623,0,0,1-3.3-32.44c2.64-7.12,7.42-13.41,12.12-19.65,6.49-8.62,12.8-17.14,13.03-27.65a60.54415,60.54415,0,0,1,7.9,13.33,16.432,16.432,0,0,0-5.12,3.76995c-.41.45-.82,1.08-.54,1.62006.24.46.84.57,1.36.62994,1.25.13,2.51.26,3.76.39,1,.11,2,.21,3,.32a63.99025,63.99025,0,0,1,2.45,12.18A61.18851,61.18851,0,0,1,615.30309,668.566Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><path d="M648.50311,642.356c-5.9,4.29-9.35,10.46-12.03,17.26a16.62776,16.62776,0,0,0-7.17,4.58c-.41.45-.82,1.08-.54,1.62006.24.46.84.57,1.36.62994,1.25.13,2.51.26,3.76.39-2.68,8.04-5.14,16.36-9.88,23.15a36.98942,36.98942,0,0,1-12.03,10.91,38.49166,38.49166,0,0,1-4.02,1.99q-7.62.585-14.95,1.25-2.805.25506-5.57.52c-1.53.14-3.04.29-4.54.43q-.015-.825,0-1.65a63.30382,63.30382,0,0,1,15.25-39.86c.45-.52.91-1.03,1.38-1.54a61.7925,61.7925,0,0,1,16.81-12.7A62.65425,62.65425,0,0,1,648.50311,642.356Z" transform="translate(-169.93432 -164.42601)" fill="#6c63ff" /><path d="M589.16308,699.526l-1.15,3.4-.58,1.73c-1.53.14-3.04.29-4.54.43l-.27.03c-1.66.17-3.31.34-4.96.51-.43-.5-.86-1.01-1.28-1.53a62.03045,62.03045,0,0,1,8.07-87.11c-1.32,6.91.22,13.53,2.75,20.1-.27.11-.53.22-.78.34a16.432,16.432,0,0,0-5.12,3.76995c-.41.45-.82,1.08-.54,1.62006.24.46.84.57,1.36.62994,1.25.13,2.51.26,3.76.39,1,.11,2,.21,3,.32q.705.075,1.41.15c.07.15.13.29.2.44,2.85,6.18,5.92,12.39,7.65,18.83a43.66591,43.66591,0,0,1,1.02,4.91A37.604,37.604,0,0,1,589.16308,699.526Z" transform="translate(-169.93432 -164.42601)" fill="#6c63ff" /><path d="M689.82123,554.48655c-8.60876-16.79219-21.94605-30.92088-37.63219-41.30357a114.2374,114.2374,0,0,0-52.5626-18.37992q-3.69043-.33535-7.399-.39281c-2.92141-.04371-46.866,12.63176-61.58712,22.98214a114.29462,114.29462,0,0,0-35.333,39.527,102.49972,102.49972,0,0,0-12.12557,51.6334,113.56387,113.56387,0,0,0,14.70268,51.47577,110.47507,110.47507,0,0,0,36.44425,38.74592C549.66655,708.561,565.07375,734.51,583.1831,735.426c18.24576.923,39.05418-23.55495,55.6951-30.98707a104.42533,104.42533,0,0,0,41.72554-34.005,110.24964,110.24964,0,0,0,19.599-48.94777c2.57368-18.08313,1.37415-36.73271-4.80123-54.01627a111.85969,111.85969,0,0,0-5.58024-12.9833c-1.77961-3.50519-6.996-4.7959-10.26142-2.69063a7.67979,7.67979,0,0,0-2.69064,10.26142q1.56766,3.08773,2.91536,6.27758l-.75606-1.7916a101.15088,101.15088,0,0,1,6.87641,25.53816l-.26791-1.99379a109.2286,109.2286,0,0,1-.06613,28.68252l.26791-1.9938a109.73379,109.73379,0,0,1-7.55462,27.67419l.75606-1.79159a104.212,104.212,0,0,1-6.67151,13.09835q-1.92308,3.18563-4.08062,6.22159c-.63172.8881-1.28287,1.761-1.939,2.63114-.85625,1.13555,1.16691-1.48321.28228-.36941-.15068.18972-.30049.3801-.45182.5693q-.68121.85165-1.3818,1.68765a93.61337,93.61337,0,0,1-10.17647,10.38359q-1.36615,1.19232-2.77786,2.33115c-.46871.37832-.932.77269-1.42079,1.12472.01861-.0134,1.57956-1.19945.65556-.511-.2905.21644-.57851.43619-.86961.65184q-2.90994,2.1558-5.97433,4.092a103.48509,103.48509,0,0,1-14.75565,7.7131l1.7916-.75606a109.21493,109.21493,0,0,1-27.59663,7.55154l1.9938-.26791a108.15361,108.15361,0,0,1-28.58907.0506l1.99379.2679a99.835,99.835,0,0,1-25.09531-6.78448l1.79159.75607a93.64314,93.64314,0,0,1-13.41605-6.99094q-3.17437-2-6.18358-4.24743c-.2862-.21359-.56992-.43038-.855-.64549-.9155-.69088.65765.50965.67021.51787a19.16864,19.16864,0,0,1-1.535-1.22469q-1.45353-1.18358-2.86136-2.4218a101.98931,101.98931,0,0,1-10.49319-10.70945q-1.21308-1.43379-2.37407-2.91054c-.33524-.4263-.9465-1.29026.40424.5289-.17775-.23939-.36206-.47414-.54159-.71223q-.64657-.85751-1.27568-1.72793-2.203-3.048-4.18787-6.24586a109.29037,109.29037,0,0,1-7.8054-15.10831l.75606,1.7916a106.58753,106.58753,0,0,1-7.34039-26.837l.26791,1.9938a97.86589,97.86589,0,0,1-.04843-25.63587l-.2679,1.9938A94.673,94.673,0,0,1,505.27587,570.55l-.75606,1.7916a101.55725,101.55725,0,0,1,7.19519-13.85624q2.0655-3.32328,4.37767-6.4847.52528-.71832,1.06244-1.42786c.324-.4279,1.215-1.49333-.30537.38842.14906-.18449.29252-.37428.43942-.56041q1.26882-1.60756,2.59959-3.1649A107.40164,107.40164,0,0,1,530.772,536.21508q1.47408-1.29171,2.99464-2.52906.6909-.56218,1.39108-1.11284c.18664-.14673.37574-.29073.56152-.43858-1.99743,1.58953-.555.43261-.10157.09288q3.13393-2.34833,6.43534-4.46134a103.64393,103.64393,0,0,1,15.38655-8.10791l-1.7916.75606c7.76008-3.25839,42.14086-10.9492,48.394-10.10973l-1.99379-.26791A106.22471,106.22471,0,0,1,628.768,517.419l-1.7916-.75606a110.31334,110.31334,0,0,1,12.6002,6.32922q3.04344,1.78405,5.96742,3.76252,1.38351.93658,2.73809,1.915.677.48917,1.34626.98885c.24789.185.49386.37253.74135.558,1.03924.779-1.43148-1.1281-.34209-.26655a110.84261,110.84261,0,0,1,10.36783,9.2532q2.401,2.445,4.63686,5.04515,1.14659,1.33419,2.24643,2.70757c.36436.45495,1.60506,2.101.08448.08457.37165.49285.74744.98239,1.11436,1.47884a97.97718,97.97718,0,0,1,8.39161,13.53807c1.79317,3.49775,6.98675,4.80186,10.26142,2.69064A7.67666,7.67666,0,0,0,689.82123,554.48655Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><path d="M602.43116,676.88167a3.77983,3.77983,0,0,1-2.73939-6.55137c.09531-.37882.16368-.65085.259-1.02968q-.05115-.12366-.1029-.24717c-3.47987-8.29769-25.685,14.83336-26.645,22.63179a30.029,30.029,0,0,0,.52714,10.32752A120.39223,120.39223,0,0,1,562.77838,652.01a116.20247,116.20247,0,0,1,.72078-12.96332q.59712-5.293,1.65679-10.51055a121.78667,121.78667,0,0,1,24.1515-51.61646c6.87378.38364,12.898-.66348,13.47967-13.98532.10346-2.36972,1.86113-4.42156,2.24841-6.756-.65621.08607-1.32321.13985-1.97941.18285-.20444.0107-.41958.02149-.624.03228l-.07709.00346a3.745,3.745,0,0,1-3.07566-6.10115q.425-.52305.85054-1.04557c.43036-.53793.87143-1.06507,1.30171-1.60292a1.865,1.865,0,0,0,.13986-.16144c.49494-.61322.98971-1.21564,1.48465-1.82885a10.82911,10.82911,0,0,0-3.55014-3.43169c-4.95941-2.90463-11.80146-.89293-15.38389,3.59313-3.59313,4.486-4.27083,10.77947-3.023,16.3843a43.39764,43.39764,0,0,0,6.003,13.3828c-.269.34429-.54872.67779-.81765,1.02209a122.57366,122.57366,0,0,0-12.79359,20.2681c1.0163-7.93863-11.41159-36.60795-16.21776-42.68052-5.773-7.29409-17.61108-4.11077-18.62815,5.13562q-.01476.13428-.02884.26849,1.07082.60411,2.0964,1.28237a5.12707,5.12707,0,0,1-2.06713,9.33031l-.10452.01613c-9.55573,13.64367,21.07745,49.1547,28.74518,41.18139a125.11045,125.11045,0,0,0-6.73449,31.69282,118.66429,118.66429,0,0,0,.08607,19.15986l-.03231-.22593C558.90163,648.154,529.674,627.51374,521.139,629.233c-4.91675.99041-9.75952.76525-9.01293,5.72484q.01788.11874.03635.2375a34.4418,34.4418,0,0,1,3.862,1.86105q1.07082.60423,2.09639,1.28237a5.12712,5.12712,0,0,1-2.06712,9.33039l-.10464.01606c-.07528.01079-.13987.02157-.21507.03237-4.34967,14.96631,27.90735,39.12,47.5177,31.43461h.01081a125.07484,125.07484,0,0,0,8.402,24.52806H601.679c.10765-.3335.20443-.67779.3013-1.01129a34.102,34.102,0,0,1-8.30521-.49477c2.22693-2.73257,4.45377-5.48664,6.6807-8.21913a1.86122,1.86122,0,0,0,.13986-.16135c1.12956-1.39849,2.26992-2.78627,3.39948-4.18476l.00061-.00173a49.95232,49.95232,0,0,0-1.46367-12.72495Zm-34.37066-67.613.0158-.02133-.0158.04282Zm-6.64832,59.93237-.25822-.58084c.01079-.41957.01079-.83914,0-1.26942,0-.11845-.0215-.23672-.0215-.35508.09678.74228.18285,1.48464.29042,2.22692Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><circle cx="95.24878" cy="439" r="11" fill="#3f3d56" /><circle cx="227.24878" cy="559" r="11" fill="#3f3d56" /><circle cx="728.24878" cy="559" r="11" fill="#3f3d56" /><circle cx="755.24878" cy="419" r="11" fill="#3f3d56" /><circle cx="723.24878" cy="317" r="11" fill="#3f3d56" /><path d="M434.1831,583.426a10.949,10.949,0,1,1-.21-2.16A10.9921,10.9921,0,0,1,434.1831,583.426Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><circle cx="484.24878" cy="349" r="11" fill="#3f3d56" /><path d="M545.1831,513.426a10.949,10.949,0,1,1-.21-2.16A10.9921,10.9921,0,0,1,545.1831,513.426Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><path d="M403.1831,481.426a10.949,10.949,0,1,1-.21-2.16A10.9921,10.9921,0,0,1,403.1831,481.426Z" transform="translate(-169.93432 -164.42601)" fill="#3f3d56" /><circle cx="599.24878" cy="443" r="11" fill="#3f3d56" /><circle cx="426.24878" cy="338" r="16" fill="#3f3d56" /><path d="M1028.875,735.26666l-857.75.30733a1.19068,1.19068,0,1,1,0-2.38136l857.75-.30734a1.19069,1.19069,0,0,1,0,2.38137Z" transform="translate(-169.93432 -164.42601)" fill="#cacaca" /></svg>
        
        </>
    )
}