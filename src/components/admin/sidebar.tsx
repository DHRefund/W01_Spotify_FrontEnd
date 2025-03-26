// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FaHome, FaUsers, FaMusic, FaMicrophone, FaChartBar } from "react-icons/fa";

// const menuItems = [
//   { icon: FaHome, label: "Dashboard", href: "/admin" },
//   { icon: FaUsers, label: "Người dùng", href: "/admin/users" },
//   { icon: FaMusic, label: "Bài hát", href: "/admin/songs" },
//   { icon: FaMicrophone, label: "Nghệ sĩ", href: "/admin/artists" },
//   { icon: FaChartBar, label: "Thống kê", href: "/admin/stats" },
// ];

// export default function AdminSidebar() {
//   const pathname = usePathname();

//   return (
//     <div className="w-64 bg-neutral-900 h-full">
//       <div className="p-6">
//         <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
//       </div>
//       <nav className="mt-6">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = pathname === item.href;

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`
//                 flex items-center gap-x-4 px-6 py-3
//                 ${isActive ? "bg-neutral-800 text-green-500" : "text-neutral-400 hover:text-white"}
//               `}
//             >
//               <Icon size={20} />
//               <span>{item.label}</span>
//             </Link>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }
