"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ruler } from "lucide-react"

const sizeCharts = {
  women: {
    tops: [
      { size: "XS", chest: "32-34", waist: "24-26", hips: "34-36" },
      { size: "S", chest: "34-36", waist: "26-28", hips: "36-38" },
      { size: "M", chest: "36-38", waist: "28-30", hips: "38-40" },
      { size: "L", chest: "38-40", waist: "30-32", hips: "40-42" },
      { size: "XL", chest: "40-42", waist: "32-34", hips: "42-44" },
      { size: "XXL", chest: "42-44", waist: "34-36", hips: "44-46" },
    ],
    bottoms: [
      { size: "XS", waist: "24-25", hips: "34-35", inseam: "30" },
      { size: "S", waist: "26-27", hips: "36-37", inseam: "30" },
      { size: "M", waist: "28-29", hips: "38-39", inseam: "32" },
      { size: "L", waist: "30-31", hips: "40-41", inseam: "32" },
      { size: "XL", waist: "32-33", hips: "42-43", inseam: "32" },
      { size: "XXL", waist: "34-35", hips: "44-45", inseam: "32" },
    ],
  },
  men: {
    tops: [
      { size: "XS", chest: "34-36", waist: "28-30", neck: "14-14.5" },
      { size: "S", chest: "36-38", waist: "30-32", neck: "15-15.5" },
      { size: "M", chest: "38-40", waist: "32-34", neck: "16-16.5" },
      { size: "L", chest: "40-42", waist: "34-36", neck: "17-17.5" },
      { size: "XL", chest: "42-44", waist: "36-38", neck: "18-18.5" },
      { size: "XXL", chest: "44-46", waist: "38-40", neck: "19-19.5" },
    ],
    bottoms: [
      { size: "XS", waist: "28-29", hips: "36-37", inseam: "30" },
      { size: "S", waist: "30-31", hips: "38-39", inseam: "32" },
      { size: "M", waist: "32-33", hips: "40-41", inseam: "32" },
      { size: "L", waist: "34-35", hips: "42-43", inseam: "34" },
      { size: "XL", waist: "36-37", hips: "44-45", inseam: "34" },
      { size: "XXL", waist: "38-39", hips: "46-47", inseam: "34" },
    ],
  },
}

interface SizeGuideModalProps {
  category?: "tops" | "bottoms"
  gender?: "women" | "men"
}

export default function SizeGuideModal({ category = "tops", gender = "women" }: SizeGuideModalProps) {
  const [selectedGender, setSelectedGender] = useState<"women" | "men">(gender)
  const [selectedCategory, setSelectedCategory] = useState<"tops" | "bottoms">(category)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Ruler className="h-4 w-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedGender} onValueChange={(value) => setSelectedGender(value as "women" | "men")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="women">Women</TabsTrigger>
            <TabsTrigger value="men">Men</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedGender} className="space-y-6">
            <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as "tops" | "bottoms")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tops">Tops</TabsTrigger>
                <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold capitalize">
                    {selectedGender} {selectedCategory} Size Chart
                  </h3>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Size</TableHead>
                        {selectedCategory === "tops" && selectedGender === "women" && (
                          <>
                            <TableHead>Chest (inches)</TableHead>
                            <TableHead>Waist (inches)</TableHead>
                            <TableHead>Hips (inches)</TableHead>
                          </>
                        )}
                        {selectedCategory === "tops" && selectedGender === "men" && (
                          <>
                            <TableHead>Chest (inches)</TableHead>
                            <TableHead>Waist (inches)</TableHead>
                            <TableHead>Neck (inches)</TableHead>
                          </>
                        )}
                        {selectedCategory === "bottoms" && (
                          <>
                            <TableHead>Waist (inches)</TableHead>
                            <TableHead>Hips (inches)</TableHead>
                            <TableHead>Inseam (inches)</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sizeCharts[selectedGender][selectedCategory].map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.size}</TableCell>
                          {selectedCategory === "tops" && selectedGender === "women" && (
                            <>
                              <TableCell>{row.chest}</TableCell>
                              <TableCell>{row.waist}</TableCell>
                              <TableCell>{row.hips}</TableCell>
                            </>
                          )}
                          {selectedCategory === "tops" && selectedGender === "men" && (
                            <>
                              <TableCell>{row.chest}</TableCell>
                              <TableCell>{row.waist}</TableCell>
                              <TableCell>{(row as any).neck}</TableCell>
                            </>
                          )}
                          {selectedCategory === "bottoms" && (
                            <>
                              <TableCell>{row.waist}</TableCell>
                              <TableCell>{row.hips}</TableCell>
                              <TableCell>{row.inseam}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How to Measure:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • <strong>Chest:</strong> Measure around the fullest part of your chest
                      </li>
                      <li>
                        • <strong>Waist:</strong> Measure around your natural waistline
                      </li>
                      <li>
                        • <strong>Hips:</strong> Measure around the fullest part of your hips
                      </li>
                      {selectedCategory === "bottoms" && (
                        <li>
                          • <strong>Inseam:</strong> Measure from crotch to ankle
                        </li>
                      )}
                      {selectedCategory === "tops" && selectedGender === "men" && (
                        <li>
                          • <strong>Neck:</strong> Measure around the base of your neck
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
